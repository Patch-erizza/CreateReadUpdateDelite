import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClientModule} from "@angular/common/http";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {User} from "./user";
import {UserService} from "./user.service";
import {FormsModule, NgModel} from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, NgTemplateOutlet, FormsModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // ТИПЫ ШАБЛОНОВ:
  // режим просмотра
  // @ts-ignore
  @ViewChild("readOnlyTemplate", {static: false}) readOnlyTemplate: TemplateRef<any>;
  // режим редактирования
  // @ts-ignore
  @ViewChild("editTemplate", {static: false}) editTemplate: TemplateRef<any>;

  editedUser: User|null = null;
  users: Array<User>;
  isNewRecord: boolean = false;
  statusMessage: string = "";

  constructor(private serv: UserService) {
    this.users = new Array<User>();
  }
  ngOnInit() {
    this.loadUsers();
  }
  // ЗАГРУЗКА ПОЛЬЗОВАТЕЛЕЙ (loadUsers()):
  // 1. создаем функцию, которая идет на сервер, запускает функцию getUsers() =>
  // 2. => дожидается (.subscribe), пока придут данные из массива юзеров
  // 3. загружает массив объектов с юзерами
  private loadUsers() {
    this.serv.getUsers().subscribe((data: Array<User>)=> {
      this.users = data;
    });
  }
  // ДОБАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ (addUser()):
  // 1. создается объект User с ранее заданными полями id, name, age
  // 2. пушится в массив юзеров
  // 3. переменная, отслеживающая создание новой записи переводится в true
  addUser() {
    this.editedUser = new User("",0);
    this.users.push(this.editedUser);
    this.isNewRecord = true;
  }
  // РЕДАКТИРОВАНИЕ ПОЛЬЗОВАТЕЛЯ (editUser()):
  // 1. функция ожидет, что в нее придет объект типа User
  // 2. на основе этого объекта создает новую переменную с полями, как в пришедшем объекте
  editUser(user: User) {
    this.editedUser = new User(user.name, user.age, user.id);
  }
  // ЗАГРУЗКА ШАБЛОНА:
  loadTemplate(user: User) {
    if (this.editedUser && this.editedUser.id === user.id) {
      return this.editTemplate;
      // editTemplate - режим редактирования
    } else {
      return this.readOnlyTemplate;
      // readOnlyTemplate - режим просмотра
    }
  }
  // СОХРАНЕНИЕ ПОЛЬЗОВАТЕЛЯ (saveUser()):
  // 1. если isNewRecord = true - создаем пользователя
  // 2. вызываем с сервера функцию createUser, передаем туда, что editedUser = User
  // 3. дожидаемся выполнения, отображаем statusMessage и вызываем функцию загрузки пользователей
  //
  // ===> переводим isNewRecord в false, editedUser в null (т.е. очищаем то, что мы создали перед этим)
  //
  // 4. иначе (если isNewRecord = false) - изменяем пользователя
  // 5. вызываем с сервера функцию createUser, передаем туда, что editedUser = User
  // 6. дожидаемся выполнения, отображаем statusMessage и вызываем функцию загрузки пользователей
  //
  // ===> переводим editedUser в null
  saveUser() {
    if (this.isNewRecord){
      this.serv.createUser(this.editedUser as User).subscribe(_ => {
        this.statusMessage = "Данные о пользователе успешно добавлены",
        this.loadUsers();
      });
      this.isNewRecord = false;
      this.editedUser = null;
    } else {
      this.serv.updateUser(this.editedUser as User).subscribe(_ => {
        this.statusMessage = "Данные успешно обновлены",
        this.loadUsers();
      });
    }
  }
  // ОТМЕНА РЕДАКТИРОВАНИЯ (cancel()):
  // 1. если isNewRecord = true, методом рор() удаляем последний элемент массива юзеров
  // 2. переводим isNewRecord в false
  // ===> переводим editedUser в null
  //
  cancel () {
    if (this.isNewRecord) {
      this.users.pop();
      this.isNewRecord = false;
    }
    this.editedUser = null;
  }
  // УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ (deleteUser()):
  // 1. передаем в функцию объект типа User
  // 2. вызываем с сервера функцию deleteUser по id юзера
  // 3. как только это произойдет, показываем statusMessage
  // 4. вызываем функцию загрузки пользователей
  deleteUser(user: User) {
    if(!user.id) {
      return;
    }
    this.serv.deleteUser(user.id).subscribe(_ => {
      this.statusMessage = "Данные пользователя успешно удалены",
      this.loadUsers();
    });
  }
}



















