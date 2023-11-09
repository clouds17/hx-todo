const db = require('./db.js')
const select  = require('@inquirer/select');  
const input   = require('@inquirer/input');  
console.log('input', input);
// 添加任务
module.exports.add = async (title) => {
    // 读取之前的任务
    const list = await db.read()
    // 往里面添加一个 title 任务
    list.push({ title, done: false })
    // // 存储任务到文件
    await db.write(list)
    
}
// 清除任务
module.exports.clear = async () => {
    await db.write([])
}

// 打印任务
async function printTask(list) {
    const answer = await select.default({
        message: '请选择操作',
        choices: [
            {
                name: '退出',
                value: '-1'
            },
            ...list.map((task, index) => {
                return {
                    name: `${task.done ? '[×]' : '[_]' } ${task.title}`,
                    value: index.toString()
                }
            }),
            {
                name: '+ 创建任务',
                value: '-2'
            }   
        ]
    });
      
    const answerIndex = parseInt(answer)
    if (answerIndex >= 0) {
        askForAction(list, answerIndex)
    } else if (answerIndex === -2) {
        queryTask('请输入要创建的任务名', async (title) => {
            list.push({
                title,
                done: false
            })
            await db.write(list)
        })
    }
}

// 选择一个任务
function askForAction(list, answerIndex) {
    select.default({
        message: '请选择一个操作',
        choices: [
            { name: '退出', value: 'quit' },
            { name: '已完成', value: 'markAsDone' },
            { name: '未完成', value: 'markAsUndone' },
            { name: '改标题', value: 'updateTitle' },
            { name: '删除', value: 'remove' }
        ]
    }).then(async result => {
        switch(result) {
            case 'quit':
                break;
            case 'markAsDone': 
                list[answerIndex].done = true
                break;
            case 'markAsUndone':
                list[answerIndex].done = false
                break;
            case 'updateTitle':
                await queryTask('请输入要修改的标题', (title) => {
                    list[answerIndex].title = title
                })
                break;
            case 'remove': 
                list.splice(answerIndex, 1)
                break;
        }

        // // 存储任务到文件
        await db.write(list)
    })
}
// 询问做什么
const queryTask = async function(msg, callback) {
    const answer = await input.default({ message: msg });
    callback(answer)
}

// showAll
module.exports.showAll = async () => {
    // 读取之前的任务
    const list = await db.read()
    // 打印之前的任务
    printTask(list)
}

