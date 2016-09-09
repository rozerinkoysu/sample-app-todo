const HomePage       = require("./pages/home.js");
const NewTodoPage    = require("./pages/new-todo.js");
const TodoDetailPage = require("./pages/todo-detail.js");
const Router         = require("./app/core/router.js");
const SMFLog         = require("./app/core/log.js");
const SMFConsole     = require("./app/core/log.js");

global.Router = Router;

// var knex = require('libs/knex.js')({});
// console.log(knex('table').insert({a: 'b'}).returning('*').toString());
Router.add("todo/new", NewTodoPage, []);
Router.add("todo/detail", TodoDetailPage, []);
Router.add("home", HomePage, []);
//Router.go("todo/detail", {id:1});
Router.go("home", {id:1});