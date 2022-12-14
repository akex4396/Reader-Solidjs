/**
 * @desc 连接数据库并返回数据库实例
 * @param {string} dbName 需要连接或者新建的数据库名字
 * @param {string} storeName 对象仓库/表 名称
 * @param {string} version 数据库的版本 默认为1
 * @param {string[]} indexList 索引列表 索引名称和索引绑定的属性名称保持一致
 * @return {Promise<IDBDatabase>} 返回一个类型为IDBDatabase的Promise对象
 */
const getDB = (dbName: string, storeName: string, indexList: string[], version?: number): Promise<IDBDatabase> => {
  let db: IDBDatabase
  return new Promise((rsv, rej) => {
    const request: IDBOpenDBRequest = indexedDB.open(dbName, version)
    request.addEventListener('success', e => {
      console.log(`IDB:${dbName} 连接成功`)
      db = (e.target as IDBOpenDBRequest).result
      rsv(db)
    })
    request.addEventListener('error', e => {
      console.error('数据库打开失败...', (e.target as IDBOpenDBRequest).error)
    })
    request.addEventListener('upgradeneeded', e => {
      db = (e.target as IDBOpenDBRequest).result

      // 判断表是否存在
      if (!db.objectStoreNames.contains(storeName)) {
        // 创建对象仓库,类型新建 sqldb 里的表
        const objectStore: IDBObjectStore = db.createObjectStore(storeName, {
          keyPath: 'id',
          autoIncrement: true
        })

        // 创建索引  objectStore.createIndex('索引名称','索引所绑定的属性',[配置对象])
        indexList.map(rawIndex => objectStore.createIndex(rawIndex, rawIndex))
      }
    })
  })
}

/**
 * @desc 添加记录
 * @param db 数据库实例
 * @param storeName 对象仓库名/表名
 * @param data 需要插入的数据
 * @warning 插入的数据是一个对象，而且必须包含声明的索引键值对。
 */
const addRecord = (db: IDBDatabase, storeName: string, data: any) => {
  // indexedDB需要通过事务进行数据的crud操作
  const request: IDBRequest<IDBValidKey> = db.transaction([storeName], 'readwrite').objectStore(storeName).add(data)

  request.onsuccess = e => {
    console.log('数据添加成功:')
    // console.log(request.result) 输入当前记录的总数
  }
  request.onerror = e => {
    console.error('数据添加失败', request.error)
  }
}

/**
 * @desc 通过主键读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} key 主键值
 */
function getRecordByKey(db: IDBDatabase, storeName: string, key: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName]) // 事务
    const objectStore = transaction.objectStore(storeName) // 仓库对象
    const request = objectStore.get(key) // 通过主键获取数据

    request.onerror = function (_) {
      console.log('事务失败')
      reject(request.error)
    }

    request.onsuccess = function (_) {
      console.log('主键查询结果: ', request.result)
      resolve(request.result)
    }
  })
}

/**
 * @desc 通过主键删除数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {number} key 主键值
 */
function deleteRecord(db: IDBDatabase, storeName: string, key: number) {
  const request = db.transaction([storeName], 'readwrite').objectStore(storeName).delete(key)

  request.onsuccess = function () {
    console.log('数据删除成功')
  }

  request.onerror = function () {
    console.log('数据删除失败')
  }
}

// class IDB {
//   dbName: string
//   storeName: string
//   version = 1
//   // 数据库实例
//   _dbInstance: IDBDatabase
//   constructor(dbName: string, storeName: string, version?: number) {
//     this.dbName = dbName
//     this.storeName = storeName
//     this.version = version || this.version
//     this.initDB()
//   }

//   // 内部方法 初始化数据库
//   private initDB() {
//     const request: IDBOpenDBRequest = indexedDB.open(this.dbName, this.version)
//     request.addEventListener('success', e => {
//       this._dbInstance = request.result
//       console.log(`数据库: ${this.dbName} 连接成功`)
//     })

//     request.onerror = e => {
//       console.error(`数据库: ${this.dbName} 连接失败...`, request.error)
//     }

//     request.addEventListener('upgradeneeded', e => {
//       this._dbInstance = (e.target as IDBOpenDBRequest).result
//       // 判断表是否存在
//       if (!this._dbInstance.objectStoreNames.contains(this.storeName)) {
//         // 创建对象仓库,类型新建 sqldb 里的表
//         const objectStore: IDBObjectStore = this._dbInstance.createObjectStore(this.storeName, {
//           keyPath: 'id',
//           autoIncrement: true
//         })

//         // 创建索引  objectStore.createIndex('索引名称','索引所绑定的属性',[配置对象])
//         objectStore.createIndex('bookName', 'bookName')
//         objectStore.createIndex('author', 'author')
//       }
//     })
//   }

//   /**
//    * @desc 添加一条记录
//    * @param data 需要添加的数据
//    * @warning 插入的数据是为对象且必须包含初始化数据库时声明的索引键值对。
//    */
//   add(data: any) {
//     console.log(this._dbInstance)
//     // indexedDB需要通过事务进行数据的crud操作
//     const request: IDBRequest<IDBValidKey> = this._dbInstance
//       .transaction([this.storeName], 'readwrite')
//       .objectStore(this.storeName)
//       .add(data)

//     request.onsuccess = e => {
//       console.log('数据添加成功:')
//       console.log(request.result) //输入当前记录的总数
//     }
//     request.onerror = e => {
//       console.error('数据添加失败', request.error)
//     }
//   }

//   /**
//    *
//    * @param key 主键值
//    * @param index 索引值
//    */
//   get(key: number, index?: string): any {
//     const request: IDBRequest<IDBValidKey> = this._dbInstance
//       .transaction([this.storeName], 'readwrite')
//       .objectStore(this.storeName)
//       .get(key)

//     request.onsuccess = e => {
//       return request.result
//     }
//     request.onerror = e => {
//       console.error('数据获取失败', request.error)
//     }
//   }

//   /**
//    * @desc 通过主键删除数据
//    * @param {number} key 主键值
//    */
//   delete(key: number) {
//     const request = this._dbInstance.transaction([this.storeName], 'readwrite').objectStore(this.storeName).delete(key)
//     request.onsuccess = () => {
//       console.log('数据删除成功')
//     }

//     request.onerror = () => {
//       console.log('数据删除失败')
//     }
//   }
// }

export { getDB, addRecord, getRecordByKey, deleteRecord }

// export { IDB }
