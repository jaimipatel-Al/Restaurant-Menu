import{_ as V}from"./default-item-BsiDVC9R.js";import{_ as ne,W as oe,x as le,y as ie,r as c,g as de,X as ue,c as d,b as n,l as v,f as R,e as f,i as h,t as g,j as C,F as j,s as q,m as k,n as $,p as ee,o}from"./index-e9uV_RJ-.js";import{_ as S}from"./AddToCart-DBdr3cIF.js";import{_ as re}from"./ComboItems-BdTgxq7-.js";import{r as me}from"./NoSymbolIcon-wtQzvxs9.js";import{r as x}from"./ArrowPathIcon-D9-DHQV_.js";import"./PlusIcon-BmWKAcbV.js";import"./XMarkIcon-DjUejM8q.js";const ce={key:0,class:"no-data"},ve={key:1,class:"no-data"},ge={key:0},_e={class:"pa-10 my-4 md:my-8 lg:my-10 w-full flex-between flex-col md:flex-row cursor-pointer md:space-x-10"},fe={class:"h-52 sm:h-72 md:h-96 w-full md:w-1/3"},pe=["src"],ye={key:1,src:V,alt:"Item Image",class:"uploaded-image"},he={class:"w-full md:w-2/3"},Ce={class:"p-1 sm:p-2 md:p-3 flex-between"},we={class:"sub-heading"},Ie={class:"price"},xe={class:"quantity-cls"},Le=["disabled"],be={class:"flex justify-start overflow-x-auto w-full"},ke={key:1,class:"main-heading"},$e={class:"h-52 sm:h-56 md:h-64 lg:h-72"},Me=["src"],Re={key:1,src:V,alt:"Item Image",class:"uploaded-image"},Ae={class:"p-1 sm:p-2 md:p-3"},Fe={class:"sub-title flex justify-between"},Te={class:"price"},je={class:"quantity-cls mb-1 md:mb-2"},qe=["disabled","onClick"],Se={key:0,class:"no-data"},Ve={key:2,class:"main-heading"},Ee={class:"flex justify-evenly items-start flex-wrap my-2 md:my-6 lg:my-10"},Ne={class:"flex items-center justify-evenly flex-wrap"},Qe={class:"h-36 sm:h-40 md:h-56 lg:h-64"},Be=["src"],We={key:1,src:V,alt:"Item Image",class:"uploaded-image"},He={class:"p-1 sm:p-2 md:p-3"},Pe={class:"text-sm sm:text-base md:text-lg lg:text-xl font-bold flex justify-between"},De={class:"price"},Ue={class:"flex justify-between mb-1 md:mb-2"},Xe={class:"quantity-cls"},Ye={class:"text-xs md:text-sm text-orange-700"},ze=["disabled","onClick"],Ge={key:3,class:"no-data"},Je={__name:"RestaurantMenu",setup(Ke){const A=ie(),E=oe(),N=le(()=>{var a;return(a=A==null?void 0:A.params)==null?void 0:a.id}),w=c(!1),p=c([]),F=c(),T=c(0),Q=c(),L=c(!1),y=c([]),B=c(0),W=c(),i=c(null),_=c([]),H=async()=>{var a;((a=p.value)==null?void 0:a.length)!=Q.value&&(T.value++,w.value=!0,await k.get(`${$.customerMenu}${N.value}?page=${T.value}&limit=8`).then(({data:e})=>{const s=e.data;Q.value=s.total,T.value==1&&(i.value=s!=null&&s.todaySpecial?{...e.data.todaySpecial,isCartLoading:!1}:null);const l=s.menus.map(I=>({...I,isCartLoading:!1}));p.value=[...p.value,...l]}).catch(e=>{var s,l;console.error((l=(s=e==null?void 0:e.response)==null?void 0:s.data)==null?void 0:l.message)}).finally(()=>{w.value=!1}))},P=async()=>{var a;((a=y.value)==null?void 0:a.length)!=W.value&&(B.value++,L.value=!0,await k.get(`${$.customerItems}${N.value}?page=${B.value}&limit=10`).then(({data:e})=>{const s=e.data;W.value=s.total;const l=s.items.map(I=>({...I,isCartLoading:!1}));y.value=[...y.value,...l]}).catch(e=>{var s,l;console.error((l=(s=e==null?void 0:e.response)==null?void 0:s.data)==null?void 0:l.message)}).finally(()=>{L.value=!1}))},te=async()=>{await k.get($.getCart).then(({data:a})=>{let e=a.data;_.value=e.items}).catch(a=>{var e,s;console.error((s=(e=a==null?void 0:a.response)==null?void 0:e.data)==null?void 0:s.message)})},M=async(a,e=!1)=>{e?i.value.isCartLoading=!0:a.isCartLoading=!0;let s={menuId:a._id,menuQuantity:1};await U(s),e?i.value.isCartLoading=!1:a.isCartLoading=!1},D=async a=>{a.isCartLoading=!0;let e={itemId:a._id,itemQuantity:1};await U(e),a.isCartLoading=!1},U=async a=>{await k.post($.addCart,a).then(({data:e})=>{var l;let s=e.data;E.setCartValue(s.itemsCount),_.value=(l=s.cart)==null?void 0:l.items}).catch(e=>{var s,l;ee.error((l=(s=e==null?void 0:e.response)==null?void 0:s.data)==null?void 0:l.message)})},X=async(a,e=!1)=>{e?i.value.isCartLoading=!0:a.isCartLoading=!0;let s={menuId:a._id};await Y(s),e?i.value.isCartLoading=!1:a.isCartLoading=!1},ae=async a=>{a.isCartLoading=!0;let e={itemId:a._id};await Y(e),a.isCartLoading=!1},Y=async a=>{await k.delete($.removeCart,{data:a}).then(({data:e})=>{var l;let s=(e==null?void 0:e.data)??{};E.setCartValue((s==null?void 0:s.itemsCount)??0),_.value=((l=s==null?void 0:s.updatedCart)==null?void 0:l.items)??[]}).catch(e=>{var s,l;ee.error((l=(s=e==null?void 0:e.response)==null?void 0:s.data)==null?void 0:l.message)})},se=()=>{const a=F.value;a&&a.scrollWidth-a.scrollLeft<=a.clientWidth+50&&!w.value&&H()},z=()=>{L.value||window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-50&&P()};return de(()=>{H(),P(),te(),F.value.addEventListener("scroll",se),window.addEventListener("scroll",z)}),ue(()=>{window.removeEventListener("scroll",z)}),(a,e)=>{var s,l,I,G,J,K,O,Z;return o(),d("section",null,[e[11]||(e[11]=n("div",{class:"px-8 py-5 text-center"},[n("h1",{class:"main-title"},"Restaurant Menu")],-1)),((s=p.value)==null?void 0:s.length)==0&&((l=y.value)==null?void 0:l.length)==0&&!L.value&&!w.value?(o(),d("div",ce,[R(h(me),{class:"no-data-icon"}),e[3]||(e[3]=f(" No Menu Available For This Restaurants "))])):v("",!0),w.value?(o(),d("div",ve,[R(h(x),{class:"no-data-icon"}),e[4]||(e[4]=f(" Loading... "))])):v("",!0),n("div",null,[i.value?(o(),d("div",ge,[e[6]||(e[6]=n("h2",{class:"main-heading"},"Today's Special Food Combos",-1)),n("div",_e,[n("div",fe,[i.value.image&&i.value.image!="null"&&i.value.image!="undefined"?(o(),d("img",{key:0,src:i.value.image,alt:"Item Image",class:"uploaded-image"},null,8,pe)):(o(),d("img",ye))]),n("div",he,[n("div",Ce,[n("div",null,[n("h3",we,g(i.value.name),1),n("p",Ie,"₹ "+g(i.value.price)+" /-",1),n("p",xe,"Quantity : "+g((I=i.value.subCategories)==null?void 0:I.length),1)]),n("div",null,[_.value.find(t=>{var r;return((r=t.menuId)==null?void 0:r._id)==i.value._id})?(o(),C(S,{key:1,value:((G=_.value.find(t=>{var r;return((r=t.menuId)==null?void 0:r._id)==i.value._id}))==null?void 0:G.quantity)??0,isLoading:i.value.isCartLoading,onRemoveItem:e[1]||(e[1]=t=>X(i.value,!0)),onAddItem:e[2]||(e[2]=t=>M(i.value,!0))},null,8,["value","isLoading"])):(o(),d("button",{key:0,disabled:i.value.isCartLoading,class:"add-btn",onClick:e[0]||(e[0]=t=>M(i.value,!0))},[i.value.isCartLoading?(o(),C(h(x),{key:0})):v("",!0),e[5]||(e[5]=f(" Add To Cart "))],8,Le))])]),n("div",be,[(o(!0),d(j,null,q(i.value.subCategories,t=>(o(),C(re,{key:t,item:t},null,8,["item"]))),128))])])])])):v("",!0),(J=p.value)!=null&&J.length?(o(),d("h2",ke,"Food Combos")):v("",!0),n("div",{ref_key:"scrollMenuComponent",ref:F,class:"flex items-center justify-start overflow-x-auto w-full p-2 sm:p-3 md:p-5"},[(o(!0),d(j,null,q(p.value,t=>{var r,b;return o(),d("div",{key:t,class:"p-1 md:p-2 shadow-2xl rounded-xl flex-none cursor-pointer my-1 md:my-2 mx-2 md:mx-4 w-64 sm:w-72 md:w-80 lg:w-96",style:{background:"rgb(255, 255, 255, 0.8)"}},[n("div",$e,[t.image&&t.image!="null"&&t.image!="undefined"?(o(),d("img",{key:0,src:t.image,alt:"Item Image",class:"uploaded-image"},null,8,Me)):(o(),d("img",Re))]),n("div",Ae,[n("h3",Fe,[f(g(t.name)+" ",1),n("span",Te,"₹ "+g(t.price)+" /-",1)]),n("p",je,"Quantity : "+g((r=t.subCategories)==null?void 0:r.length),1),_.value.find(u=>{var m;return((m=u.menuId)==null?void 0:m._id)==t._id})?(o(),C(S,{key:1,value:((b=_.value.find(u=>{var m;return((m=u.menuId)==null?void 0:m._id)==t._id}))==null?void 0:b.quantity)??0,isLoading:t.isCartLoading,onRemoveItem:u=>X(t),onAddItem:u=>M(t)},null,8,["value","isLoading","onRemoveItem","onAddItem"])):(o(),d("button",{key:0,disabled:t.isCartLoading,class:"add-btn",onClick:u=>M(t)},[t.isCartLoading?(o(),C(h(x),{key:0})):v("",!0),e[7]||(e[7]=f(" Add To Cart "))],8,qe))])])}),128)),(K=p.value)!=null&&K.length&&w.value?(o(),d("div",Se,[R(h(x),{class:"no-data-icon"}),e[8]||(e[8]=f(" Loading... "))])):v("",!0)],512),(O=y.value)!=null&&O.length?(o(),d("h2",Ve,"Food Items")):v("",!0),n("div",Ee,[n("div",Ne,[(o(!0),d(j,null,q(y.value,t=>{var r,b;return o(),d("div",{key:t._id,class:"p-1 md:p-2 shadow-2xl rounded-xl w-40 sm:w-56 md:w-64 lg:w-72 my-2 md:my-4 mx-1 md:mx-2",style:{background:"rgb(255, 255, 255, 0.8)"}},[n("div",Qe,[t.image&&t.image!="null"&&t.image!="undefined"?(o(),d("img",{key:0,src:t.image,alt:"Item Image",class:"uploaded-image"},null,8,Be)):(o(),d("img",We))]),n("div",He,[n("h3",Pe,[f(g(t.title)+" ",1),n("span",De,"₹ "+g(t.price)+" /-",1)]),n("p",Ue,[n("span",Xe,"Quantity : "+g(t.quantity),1),n("span",Ye,g((r=t.categoryId)==null?void 0:r.title),1)]),_.value.find(u=>{var m;return((m=u==null?void 0:u.itemId)==null?void 0:m._id)==t._id})?(o(),C(S,{key:1,value:((b=_.value.find(u=>{var m;return((m=u.itemId)==null?void 0:m._id)==t._id}))==null?void 0:b.quantity)??0,isLoading:t.isCartLoading,onRemoveItem:u=>ae(t),onAddItem:u=>D(t)},null,8,["value","isLoading","onRemoveItem","onAddItem"])):(o(),d("button",{key:0,disabled:t.isCartLoading,class:"add-btn",onClick:u=>D(t)},[t.isCartLoading?(o(),C(h(x),{key:0})):v("",!0),e[9]||(e[9]=f(" Add To Cart "))],8,ze))])])}),128))])]),(Z=y.value)!=null&&Z.length&&L.value?(o(),d("div",Ge,[R(h(x),{class:"no-data-icon"}),e[10]||(e[10]=f(" Loading... "))])):v("",!0)])])}}},lt=ne(Je,[["__scopeId","data-v-37c84fbe"]]);export{lt as default};
