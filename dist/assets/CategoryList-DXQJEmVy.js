import{_ as S,u as b,r as c,g as L,c as o,b as i,f as d,w as p,i as l,R as h,l as N,e as g,F as B,s as E,m as C,n as x,a as R,o as n,t as V,p as w}from"./index-e9uV_RJ-.js";import{_ as A}from"./AddEditIcon-X75OXq2v.js";import{r as F}from"./NoSymbolIcon-wtQzvxs9.js";import{r as H}from"./ArrowPathIcon-D9-DHQV_.js";import{r as M}from"./PlusIcon-BmWKAcbV.js";import"./TrashIcon-1h6QmHTQ.js";const T="/Restaurant-Menu/assets/default-category-fN7Sf7ck.png",q={class:"bg-screen"},j={class:"main-header-nav"},z={key:0,class:"no-data"},G={class:"h-48 md:h-58 w-full sm:w-72 md:w-64 flex-none"},J=["src"],K={key:1,src:T,alt:"Category Image"},O={class:"flex-auto p-2"},P={class:"auth-detail"},Q={key:2,class:"no-data"},U={__name:"CategoryList",setup(W){const k=R(),D=b(),u=c(!1),r=c([]),m=c(),f=c(0),v=c(),y=async()=>{var s;((s=r.value)==null?void 0:s.length)!=v.value&&(f.value++,u.value=!0,await C.get(`${x.listCategory}?page=${f.value}&limit=8`).then(({data:e})=>{const a=e.data;v.value=a.totalCategories;const t=a.categories.map(_=>({..._,isDeleting:!1}));r.value=[...r.value,...t]}).catch(e=>{var a,t;console.error((t=(a=e==null?void 0:e.response)==null?void 0:a.data)==null?void 0:t.message)}).finally(()=>{u.value=!1}))},$=async s=>{s.isDeleting=!0,await C.delete(`${x.deleteCategory}${s._id}`).then(()=>{w.success("Category deleted successfully!!"),f.value=0,v.value=null,r.value=[],y()}).catch(e=>{var a,t;w.error((t=(a=e==null?void 0:e.response)==null?void 0:a.data)==null?void 0:t.message)}).finally(()=>{s.isDeleting=!1})},I=()=>{const s=m.value;s&&s.scrollHeight-s.scrollTop<=s.clientHeight+50&&!u.value&&y()};return L(()=>{y(),m.value.addEventListener("scroll",I)}),(s,e)=>{var a;return n(),o("section",q,[i("div",j,[e[1]||(e[1]=i("h1",{class:"main-title"},"Category",-1)),d(l(h),{to:"/category/add-category",class:"add-btn"},{default:p(()=>[d(l(M)),e[0]||(e[0]=g(" Add Category"))]),_:1})]),i("div",{ref_key:"scrollComponent",ref:m,class:"h-5/6 overflow-y-auto"},[((a=r.value)==null?void 0:a.length)==0&&!u.value?(n(),o("div",z,[d(l(F),{class:"no-data-icon"}),e[2]||(e[2]=g(" No Category Available "))])):(n(!0),o(B,{key:1},E(r.value,t=>(n(),o("div",{key:t._id,class:"md:w-5/6 h-auto md:h-58 mx-8 md:mx-auto p-3 my-8 shadow-2xl rounded-xl flex sm:space-x-5 flex-col sm:flex-row",style:{background:"rgb(255, 255, 255, 0.8)"}},[i("div",G,[t.image&&t.image!="null"&&t.image!="undefined"?(n(),o("img",{key:0,src:t.image,alt:"Category Image",class:"full-image"},null,8,J)):(n(),o("img",K))]),i("div",O,[d(A,{title:t.title,isShow:t.createdBy==l(D).userData.userId,onEditItem:_=>l(k).push(`/category/edit-category/${t._id}`),onDeleteItem:_=>$(t),isDeleting:t.isDeleting},null,8,["title","isShow","onEditItem","onDeleteItem","isDeleting"]),d(l(h),{to:"/item",class:"text-orange-400 text-sm"},{default:p(()=>e[3]||(e[3]=[g("Show Items")])),_:1}),i("p",P,V(t.description),1)])]))),128)),u.value?(n(),o("div",Q,[d(l(H),{class:"no-data-icon"}),e[4]||(e[4]=g(" Loading..."))])):N("",!0)],512)])}}},ae=S(U,[["__scopeId","data-v-53bf2e5a"]]);export{ae as default};
