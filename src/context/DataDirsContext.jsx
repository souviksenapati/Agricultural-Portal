/**
 * 
 * DataDirsContext — fetches all reference/location data once on app start.
 *
 * APIs used (no auth required):
 *   GET /api/data_dirs              → districts, blocks, gram_panchayats, police_stations
 *   GET /api/data_dirs/village_data/all  → villages
 *   GET /api/data_dirs/mouza_data/all    → mouzas
 *
 * All items have numeric `id` fields. Relationships:
 *   block.district_id        → belongs to district
 *   gram_panchayat.block_id  → belongs to block
 *   village.gram_panchayat_id→ belongs to gram panchayat
 *   mouza.block_id           → belongs to block
 *   police_station.district_id→ belongs to district
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiGet } from '../api/client';

const DataDirsContext = createContext(null);

export function useDataDirs() {
  return useContext(DataDirsContext);
}

export function DataDirsProvider({ children }) {
  const [districts, setDistricts]         = useState([]);
  const [blocks, setBlocks]               = useState([]);
  const [gramPanchayats, setGramPanchayats] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  const [villages, setVillages]           = useState([]);
  const [mouzas, setMouzas]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  useEffect(() => {
    async function loadAll() {
      try {
        // All three fetch in parallel — no auth needed
        const [dirs, vils, mouz] = await Promise.all([
          apiGet('/data_dirs'),
          apiGet('/data_dirs/village_data/all'),
          apiGet('/data_dirs/mouza_data/all'),
        ]);
        setDistricts(dirs.districts       || []);
        setBlocks(dirs.blocks             || []);
        setGramPanchayats(dirs.gram_panchayats || []);
        setPoliceStations(dirs.police_stations || []);
        setVillages(Array.isArray(vils) ? vils : []);
        setMouzas(Array.isArray(mouz) ? mouz : []);
      } catch (e) {
        console.error('[DataDirs] Failed to load reference data:', e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  // ── Filtered lookup helpers (return arrays) ─────────────────────────────────

  /** Blocks for a given district id (string or number) */
  const blocksByDistrict = (districtId) =>
    districtId ? blocks.filter((b) => b.district_id === Number(districtId)) : [];

  /** Gram Panchayats for a given block id */
  const gpsByBlock = (blockId) =>
    blockId ? gramPanchayats.filter((g) => g.block_id === Number(blockId)) : [];

  /** Villages for a given gram panchayat id */
  const villagesByGP = (gpId) =>
    gpId ? villages.filter((v) => v.gram_panchayat_id === Number(gpId)) : [];

  /** Mouzas for a given block id */
  const mouzasByBlock = (blockId) =>
    blockId ? mouzas.filter((m) => m.block_id === Number(blockId)) : [];

  /** Police stations for a given district id */
  const policeStationsByDistrict = (districtId) =>
    districtId ? policeStations.filter((p) => p.district_id === Number(districtId)) : [];

  // ── Name lookup helpers (id → name string) ──────────────────────────────────

  const districtName      = (id) => districts.find((d)      => d.id === Number(id))?.name || '';
  const blockName         = (id) => blocks.find((b)          => b.id === Number(id))?.name || '';
  const gpName            = (id) => gramPanchayats.find((g)  => g.id === Number(id))?.name || '';
  const villageName       = (id) => villages.find((v)        => v.id === Number(id))?.name || '';
  const mouzaName         = (id) => mouzas.find((m)          => m.id === Number(id))?.name || '';
  const policeStationName = (id) => policeStations.find((p)  => p.id === Number(id))?.name || '';

  return (
    <DataDirsContext.Provider value={{
      // Raw arrays
      districts, blocks, gramPanchayats, policeStations, villages, mouzas,
      // Filter helpers (id → filtered array)
      blocksByDistrict, gpsByBlock, villagesByGP, mouzasByBlock, policeStationsByDistrict,
      // Name lookup helpers (id → name string)
      districtName, blockName, gpName, villageName, mouzaName, policeStationName,
      // State
      loading, error,
    }}>
      {children}
    </DataDirsContext.Provider>
  );
}
