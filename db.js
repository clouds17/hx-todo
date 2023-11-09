// 获取电脑里的home目录
const homedir = require('os').homedir()
// 如果环境变量没有HOME，避免用户自己设置了HOME目录
const home = process.env.HOME || homedir;
const fs = require('fs')
const path = require('path')
const dbPath = path.join(home, '.todo')

const db = {
    read(path = dbPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, { flag: 'a+' }, (err, data) => {
                if (err) {
                    return reject(err)
                }
                let list
                try {
                    list = JSON.parse(data.toString())
                } catch(err2) {
                    list = []
                }
                resolve(list)
            })
        })
    },
    write(list, path = dbPath) {
        return new Promise((resolve, reject) => {
            const string = JSON.stringify(list)
            fs.writeFile(path, string+'\n', (err) => {
                if (err) {
                    return reject(err)
                }
                resolve(string)
            })
        })
    }
}


module.exports = db