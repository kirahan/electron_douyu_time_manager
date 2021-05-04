import { ipcRenderer } from 'electron'
declare global {
    interface Window {
        ipcRenderer:any;
    }
}

window.ipcRenderer = ipcRenderer
console.log('preload loaded')



// setTimeout(()=>{
//     console.log('[run 5 second]')

//     const douyuroom = document.querySelector("webview")
//     // console.log('find douyuroom pannel',douyuroom)

//     // douyuroom.executeJavaScript(`
//     //     const header = document.querySelector(".layout-Header")
//     //     const aside = document.querySelector(".layout-Aside")
//     //     const right = document.querySelector(".layout-Player-aside")
//     //     const toolbar = document.querySelector(".layout-Player-toolbar")
//     //     const video = document.querySelector(".layout-Player-video")
//     //     const bottom = document.querySelector(".layout-Bottom")
//     //     header.style.display = "none"
//     //     aside.style.display = "none"
//     //     right.style.display = "none"
//     //     toolbar.style.display = "none"
//     //     video.style.display = "none"
//     //     bottom.style.display = "none"


//     //     // const avatar = document.querySelector(".Title-anchorPic")
//     //     // avatar.style.display = "none"

//     //     // const collist = document.querySelectorAll(".Title-col")
//     //     // for (col of collist){
//     //     //     col.style.display = "none"
//     //     // }

//     //     // const followPannel = collist[0]
//     //     // followPannel.style.display = "block"
//     //     // followPannel.style.float = "none"

//     //     const follownum = document.querySelector('.Title-followNum').innerText
//     //     console.log(follownum)

    
//     //     `)

//     douyuroom.openDevTools()
// },5000)

// 1、diaplay:none  真正意义上的隐藏，页面源码都不显示隐藏的页面源码，隐藏的元素不占用任何空间，元素的盒空间都不生成，好像元素就不存在，但是可以通过DOM操作访问到，如$(" ")

// 2、position:absolute 为了不影响页面布局又想与之交互，opacity 和 visibility会 影响布局， display 不影响布局但又无法直接交互 position属性将元素移出原来的页面显示（像是页面上的又一层）并可以与之交互，如填表单之类的可以使用

// 3、opacity:0 opacity属性时设置元素的透明度，会影响页面布局 但只是不可见 元素位置显示一块空白，会影响页面交互操作

// 4、visibility:hidden  也只是显示不可见，元素位置处显示一块空白，会影响布局，不过不会影响交互操作。