{

  let view = {
    el: '.list',
    init() {
      this.$el = $(this.el)
    },
    template: `
        <div class="homeListHeadWrapper">
           <h4 class="listTitle">最新歌单</h4>
        </div>
        <div class="swiper-container">
        <ul class="swiper-wrapper">
          <li class="swiper-slide">
            <div class="listCover">
              <img src="./img/home/list-cover-1.jpg" alt="">
            </div>
            <div class="listInfo">
              <p class="listName">我是歌单名称哈哈哈</p>
              <p class="listCreator">我是创建者</p>
            </div>
          </li>
        </ul>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
        </div>
    `,
    render(data){
      this.$el.html(this.template)
      let { playlists } = data
      let liDoms = playlists.map((list)=>{
        return `<li data-name=${list.id} class="swiper-slide">
        <div class="listCover">
          <img src="${list.cover}" alt="">
        </div>
        <div class="listInfo">
          <p class="listName">${list.name}</p>
          <p class="listCreator">admin</p>
        </div>
      </li>
        `
      })
      this.$el.find('ul').empty()
      liDoms.map((liDom)=>{
        this.$el.find('ul').append(liDom)
      })
    }
  }

  let model = {
    data:{
      playlists: []
    },
    find(){
      let query = new AV.Query('Playlist')
      query.descending('updatedAt')
      query.limit(7)
      // query.ascending('createdAt')
      return query.find().then((playlist) => {
        this.data.playlists = playlist.map((list) => {
          let playlists = { id: list.id, ...list.attributes }
          let createDate = list.createdAt.toLocaleDateString()
          let createHours = time(list.createdAt.getHours())
          let createMinutes = time(list.createdAt.getMinutes())
          let createSeconds = time(list.createdAt.getSeconds())

          let updateDate = list.updatedAt.toLocaleDateString()
          let updateHours = time(list.updatedAt.getHours())
          let updateMinutes = time(list.updatedAt.getMinutes())
          let updateSeconds = time(list.updatedAt.getSeconds())
          function time(time) {
            if (time < 10) {
              time = '0' + time
            }
            return time
          }
          let createTime = createDate + ' ' + createHours + ':' + createMinutes + ':' + createSeconds
          let updateTime = updateDate + ' ' + updateHours + ':' + updateMinutes + ':' + updateSeconds
          playlists.createTime = createTime
          playlists.updateTime = updateTime
          return playlists
        })
        return playlist
      })
    }
  }

  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.view.render(this.model.data)
      this.isToEnd = false
      this.isToStart = true
      this.isAnimate = false
      this.model.find().then(()=>{
        this.view.render(this.model.data)
      })
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents() {
      this.view.$el.on('click','.right',()=>{
        let itemWidth = this.view.$el.find('li').outerWidth(true)
        console.log(itemWidth)
      })
      this.view.$el.on('click','li',(e)=>{
        let $e = $(e.currentTarget)
        let playlist
        let listId = $e.attr('data-name')
        let {playlists} = this.model.data
        for(let i=0; i<playlists.length; i++){
          if(playlists[i].id === listId){
            playlist = playlists[i]
          }
        }
        window.eventHub.emit('homeToDetail',playlist)
      })
    },
    bindEventHub() {
      window.eventHub.on('createPlaylist',()=>{
        this.model.find().then(()=>{
          this.view.render(this.model.data)
        })
      })
      window.eventHub.on('updatePlaylist',()=>{
        this.model.find().then(()=>{
          this.view.render(this.model.data)
        })
      })
      window.eventHub.on('listDeleteDone',(data)=>{
          this.view.render(data)
      })
    }
  }
  controller.init(view, model)
}