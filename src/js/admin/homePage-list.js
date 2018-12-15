{
  let view = {
    el: '.list',
    init() {
      this.$el = $(this.el)
    },
    template: `
        <div class="homeListHeadWrapper">
           <h4 class="listTitle">最新歌单</h4>
           <div class="actions">
            <i class="fas fa-angle-left left"></i>
            <i class="fas fa-angle-right right"></i>
           </div>
        </div>
        <ul>
          <li>
            <div class="listCover">
              <img src="./img/home/list-cover-1.jpg" alt="">
            </div>
            <div class="listInfo">
              <p class="listName">我是歌单名称哈哈哈</p>
              <p class="listCreator">我是创建者</p>
            </div>
          </li>
        </ul>
    `,
    render(data){
      this.$el.html(this.template)
      let { playlists } = data
      let liDoms = playlists.map((list)=>{
        return `<li>
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
      // query.limit(7)
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
      this.view.$el.on('click','.left',(e)=>{
        if(this.isAnimate) return
        let itemWidth = this.view.$el.find('li').outerWidth(true)
        let wrapperWidth = this.view.$el.width()
        let rowCount = Math.floor(wrapperWidth/itemWidth)
        console.log('------')
        console.log(this.view.$el.find('ul').css('left'))
        if(!this.isToStart){
          this.isAnimate = true
          this.view.$el.find('ul').animate({
            left: '+=' + rowCount*itemWidth
          },400,()=>{
            console.log('xxxxxx')
            console.log(this.view.$el.find('ul').css('left'))
            this.isAnimate = false
            this.isToEnd = false
            if( parseFloat(this.view.$el.find('ul').css('left')) >= 0){
              this.isToStart = true
            }
          })
        }
      })
      this.view.$el.on('click','.right',(e)=>{
        if(this.isAnimate) return
        let itemWidth = this.view.$el.find('li').outerWidth(true)
        let wrapperWidth = this.view.$el.width()
        let rowCount = Math.floor(wrapperWidth/itemWidth)
        if(!this.isToEnd){
          this.isAnimate = true
          this.view.$el.find('ul').animate({
            left: '-=' + itemWidth*rowCount
          },400,()=>{
            this.isAnimate = false
            this.isToStart = false
            if( parseFloat(this.view.$el.width()) - parseFloat(this.view.$el.find('ul').css('left')) >= parseFloat(this.view.$el.find('ul').css('width'))){
              this.isToEnd = true
            }
          })
        }
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