"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[207],{9207:(b,p,o)=>{o.r(p),o.d(p,{BasketModule:()=>s});var m=o(6895),i=o(9838),t=o(1571),l=o(5866),v=o(5053),k=o(8795);function f(n,e){1&n&&(t.TgZ(0,"div")(1,"p"),t._uU(2,"There are no items in your basket"),t.qZA()())}function y(n,e){if(1&n){const r=t.EpF();t.ynx(0),t.TgZ(1,"div",2)(2,"div",3)(3,"div",4)(4,"app-basket-summary",5),t.NdJ("addItem",function(d){t.CHM(r);const u=t.oxw();return t.KtG(u.incrementQuantity(d))})("removeItem",function(d){t.CHM(r);const u=t.oxw();return t.KtG(u.removeItem(d))}),t.qZA()(),t.TgZ(5,"div",6),t._UZ(6,"app-order-totals"),t.TgZ(7,"div",7)(8,"a",8),t._uU(9," Proceed to checkout "),t.qZA()()()()(),t.BQk()}}class c{constructor(e){this.basketService=e}incrementQuantity(e){this.basketService.addItemToBasket(e)}removeItem(e){this.basketService.removeItemFromBasket(e.id,e.quantity)}}c.\u0275fac=function(e){return new(e||c)(t.Y36(l.v))},c.\u0275cmp=t.Xpm({type:c,selectors:[["app-basket"]],decls:5,vars:6,consts:[[1,"container","mt-5"],[4,"ngIf"],[1,"container"],[1,"row"],[1,"col-md-8"],[3,"addItem","removeItem"],[1,"col-md-4"],[1,"d-grid","mb-2"],["routerLink","/checkout",1,"btn","btn-outline-primary","py-2"]],template:function(e,r){1&e&&(t.TgZ(0,"div",0),t.YNc(1,f,3,0,"div",1),t.ALo(2,"async"),t.YNc(3,y,10,0,"ng-container",1),t.ALo(4,"async"),t.qZA()),2&e&&(t.xp6(1),t.Q6J("ngIf",null===t.lcZ(2,2,r.basketService.basketSource$)),t.xp6(2),t.Q6J("ngIf",t.lcZ(4,4,r.basketService.basketSource$)))},dependencies:[m.O5,i.rH,v.S,k.b,m.Ov]});const B=[{path:"",component:c}];class a{}a.\u0275fac=function(e){return new(e||a)},a.\u0275mod=t.oAB({type:a}),a.\u0275inj=t.cJS({imports:[i.Bz.forChild(B),i.Bz]});var g=o(4823);class s{}s.\u0275fac=function(e){return new(e||s)},s.\u0275mod=t.oAB({type:s}),s.\u0275inj=t.cJS({imports:[m.ez,a,g.m]})}}]);