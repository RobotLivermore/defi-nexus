import { openDB, IDBPDatabase, DBSchema } from 'idb'

const useDB = () => {

  const open = async (key: string) => {
    const db = await openDB('evm-logs', 1, {
      upgrade(db) {
        db.createObjectStore(key, { keyPath: 'id', autoIncrement: true })
      },
    })
    return db
  }



  return { open }
}

export default useDB
