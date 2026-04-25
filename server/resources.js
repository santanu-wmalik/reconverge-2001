// Generic CRUD endpoint factory.
//
// Mounts these routes under /api/<name>:
//   GET    /                 → list (with ?col=val filters and ?_sort=&_order=)
//   GET    /:id              → fetch one
//   POST   /                 → insert (id auto-generated if not in body)
//   PATCH  /:id              → partial update
//   PUT    /:id              → full replace (treated as PATCH; pg lacks "replace")
//   DELETE /:id              → delete
//
// Stays compatible with the json-server-shaped surface the React client
// already uses: same paths, same camelCase field names, same query params.

import { tables, sqlTable, coerce, rowToJson } from './columns.js';
import { query } from './db.js';

const newId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

// Pick fields from a body that map to known columns of `table`. Unknown
// fields are dropped silently — the client won't accidentally insert junk.
function pickColumns(table, body, { excludeId = false } = {}) {
  const map = tables[table];
  const out = {};
  for (const [field, def] of Object.entries(map)) {
    if (excludeId && field === 'id') continue;
    if (Object.prototype.hasOwnProperty.call(body || {}, field)) {
      out[def.col] = coerce(body[field], def.type);
    }
  }
  return out;
}

export function mountResource(app, name, opts = {}) {
  const table = sqlTable[name];
  const map = tables[name];
  if (!table || !map) throw new Error(`Unknown resource: ${name}`);
  const idColDef = map.id;

  // Allowed filter fields (camelCase). If `filterable` not given, derive from
  // the column map — every text/int/bool column except `id` is filterable.
  const filterable = opts.filterable
    ? new Set(opts.filterable)
    : new Set(
        Object.entries(map)
          .filter(([f, d]) => f !== 'id' && ['text', 'int', 'bool'].includes(d.type))
          .map(([f]) => f)
      );

  // Sort handling: if ?_sort=createdAt&_order=desc is given, translate to
  // ORDER BY <col> <dir>. Otherwise use opts.defaultSort or no ORDER BY.
  const sortableFields = new Set(Object.keys(map));

  // ─── LIST ──────────────────────────────────────────────────────────────
  app.get(`/api/${name}`, async (req, res, next) => {
    try {
      const wheres = [];
      const params = [];
      for (const [key, val] of Object.entries(req.query)) {
        if (key.startsWith('_')) continue; // _sort, _order, _limit reserved
        if (!filterable.has(key)) continue;
        const def = map[key];
        params.push(coerce(val, def.type));
        wheres.push(`${def.col} = $${params.length}`);
      }

      // Sort
      let orderBy = '';
      const sortField = req.query._sort;
      const sortOrder = (req.query._order || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC';
      if (sortField && sortableFields.has(sortField)) {
        orderBy = `ORDER BY ${map[sortField].col} ${sortOrder}`;
      } else if (opts.defaultSort) {
        orderBy = `ORDER BY ${opts.defaultSort.column} ${opts.defaultSort.direction || 'ASC'}`;
      }

      const sql = `SELECT * FROM ${table}${wheres.length ? ' WHERE ' + wheres.join(' AND ') : ''} ${orderBy}`;
      const r = await query(sql, params);
      res.json(r.rows.map((row) => rowToJson(name, row)));
    } catch (err) {
      next(err);
    }
  });

  // ─── GET ONE ───────────────────────────────────────────────────────────
  app.get(`/api/${name}/:id`, async (req, res, next) => {
    try {
      const r = await query(
        `SELECT * FROM ${table} WHERE ${idColDef.col} = $1`,
        [coerce(req.params.id, idColDef.type)]
      );
      if (r.rowCount === 0) return res.status(404).json({ error: `${name} not found` });
      res.json(rowToJson(name, r.rows[0]));
    } catch (err) {
      next(err);
    }
  });

  // ─── CREATE ────────────────────────────────────────────────────────────
  app.post(`/api/${name}`, async (req, res, next) => {
    try {
      const data = pickColumns(name, req.body || {});
      // Ensure an id — fall back to a generated one shaped like the legacy
      // string ids (`alum-...`, `custom-...`) so client code that keys on the
      // returned id keeps working.
      if (data[idColDef.col] === null || data[idColDef.col] === undefined) {
        data[idColDef.col] = newId(name.replace(/s$/, '').slice(0, 8));
      }
      const cols = Object.keys(data);
      const placeholders = cols.map((_, i) => `$${i + 1}`);
      const sql = `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
      const r = await query(sql, Object.values(data));
      res.status(201).json(rowToJson(name, r.rows[0]));
    } catch (err) {
      // Surface unique-constraint violations as 409 so the client can react.
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Duplicate key', detail: err.detail });
      }
      next(err);
    }
  });

  // ─── UPDATE (PATCH or PUT — same behaviour) ────────────────────────────
  const handleUpdate = async (req, res, next) => {
    try {
      const data = pickColumns(name, req.body || {}, { excludeId: true });
      const cols = Object.keys(data);
      if (cols.length === 0) {
        // Empty patch — return current row instead of failing.
        const r0 = await query(
          `SELECT * FROM ${table} WHERE ${idColDef.col} = $1`,
          [coerce(req.params.id, idColDef.type)]
        );
        if (r0.rowCount === 0) return res.status(404).json({ error: `${name} not found` });
        return res.json(rowToJson(name, r0.rows[0]));
      }
      const setSql = cols.map((c, i) => `${c} = $${i + 1}`).join(', ');
      const sql = `UPDATE ${table} SET ${setSql} WHERE ${idColDef.col} = $${cols.length + 1} RETURNING *`;
      const params = [...Object.values(data), coerce(req.params.id, idColDef.type)];
      const r = await query(sql, params);
      if (r.rowCount === 0) return res.status(404).json({ error: `${name} not found` });
      res.json(rowToJson(name, r.rows[0]));
    } catch (err) {
      next(err);
    }
  };
  app.patch(`/api/${name}/:id`, handleUpdate);
  app.put(`/api/${name}/:id`, handleUpdate);

  // ─── DELETE ────────────────────────────────────────────────────────────
  app.delete(`/api/${name}/:id`, async (req, res, next) => {
    try {
      const r = await query(
        `DELETE FROM ${table} WHERE ${idColDef.col} = $1 RETURNING ${idColDef.col}`,
        [coerce(req.params.id, idColDef.type)]
      );
      if (r.rowCount === 0) return res.status(404).json({ error: `${name} not found` });
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });
}
