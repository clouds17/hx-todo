#!/usr/bin/env node
const { program } = require('commander');
const api = require('./index.js')
const  pkg = require('./package.json')

program
  .name(pkg.name)
  .description(pkg.dependencies)
  .version(pkg.version);


program
  .command('add')
  .description('add a task')
  .argument('<taskName>', 'taskName')
  .action((title) => {
    api.add(title).then(() => {
      console.log('添加成功');
    }, () => {
      console.log('添加失败');
    })
  })

program
  .command('clear')
  .description('clear the task')
  .action(() => {
    api.clear().then(() => {
      console.log('清除成功');
    }, () => {
      console.log('清除失败');
    })
  })

program
  .command('show')
  .description('show all task')
  .action(() => {
    api.showAll()
  })

program.parse(process.argv);

