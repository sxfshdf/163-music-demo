{
  let view = {
    el: '.allSongList',
    template: `
    <div class="tableContainer">
      <table>
        <thead>
          <tr>
            <th class="cover">封面</th>
            <th class="listName">歌单名</th>
            <th class="createTime">创建时间</th>
            <th class="updateTime">更新时间</th>
            <th class="actions">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="cover">
              <img src="./img/home/list-cover-1.jpg" alt="">
            </td>
            <td class="listName">陈势安陈</td>
            <td class="createTime">2018/12/5 下午10:57:23</td>
            <td class="updateTime">2018/12/5 下午10:57:23</td>
            <td>
              <span class="far fa-edit edit"></span>
              <span class="far fa-trash-alt delete"></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    `,
    init(){
      this.$el = $(this.el)
    },
    render(data){
      this.$el.html(this.template)
      let { playlists } = data
      let listDoms = playlists.map((list)=>{
        return ` <tr data-listId = ${list.id}>
        <td class="cover">
          <img src="${list.cover}" alt="">
        </td>
        <td class="listName">${list.name}</td>
        <td class="createTime">${list.createTime}</td>
        <td class="updateTime">${list.updateTime}</td>
        <td>
          <span class="far fa-edit edit"></span>
          <span class="far fa-trash-alt delete"></span>
        </td>
      </tr>`
      })
      this.$el.find('tbody').empty()
      listDoms.map((listDom) => {
        $(this.el).find('tbody').append(listDom)
      })
    },
    show(){
      this.$el.css('display','block')
    },
    hide(){
      this.$el.css('display','none')
    }
  }

  let model = {
    data:{
      playlists:[]
    },
    find(){
      let query = new AV.Query('Playlist')
      query.descending('updatedAt')
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
    },
    delete(data) {
      let playlist = AV.Object.createWithoutData('Playlist', data.id)
      return playlist.destroy().then((xxx) => {
      })
    }
  }

  let controller = {
    init(view,model){
      this.view = view
      this.view.init()
      this.model = model
      // this.view.render(this.model.data)
      this.bindEvents()
      this.model.find().then(()=>{
        this.view.render(this.model.data)
      })
      this.bindEventHub()
    },
    bindEvents(){
      $(this.view.el).on('click', '.edit', (e) => {
        e.preventDefault()
        let $e = $(e.currentTarget)
        let listId = $e.parent().parent().attr('data-listId')
        let data
        let playlists = this.model.data.playlists
        for (let i = 0; i < playlists.length; i++) {
          if (playlists[i].id === listId) {
            data = playlists[i]
            break
          }
        }
        window.eventHub.emit('editList', JSON.parse(JSON.stringify(data)))
      })
      $(this.view.el).on('click', '.delete', (e) => {
        let $e = $(e.currentTarget)
        let listId = $e.parent().parent().attr('data-listId')
        let data
        let playlists = this.model.data.playlists
        for (let i = 0; i < playlists.length; i++) {
          if (playlists[i].id === listId) {
            data = playlists[i]
            break
          }
        }
        window.eventHub.emit('deleteList', JSON.parse(JSON.stringify(data)))
      })
      $(this.view.el).on('click','td.listName',(e)=>{
        let $e = $(e.currentTarget)
        let listId = $e.parent().attr('data-listid')
        let {playlists} = this.model.data
        let playlist
        for(let i=0; i<playlists.length; i++){
          if(playlists[i].id === listId){
            playlist = playlists[i]
          }
        }
        window.eventHub.emit('toListDetail',playlist)
      })
    },
    bindEventHub(){
      window.eventHub.on('selectTab',(tabName)=>{
        if(tabName === 'song'){
          this.view.show()
          $(this.view.el).siblings().css('display','none').siblings('header').css('display','block')
        }else{
          this.view.hide()
        }
      })
      window.eventHub.on('createList',()=>{
        this.view.hide()
      })
      window.eventHub.on('createPlaylist',(data)=>{
        this.view.show()
        this.model.data.playlists.unshift(data)
        this.view.render(this.model.data)
      })
      window.eventHub.on('createListCancel',(data)=>{
        this.view.show()
      })
      window.eventHub.on('editList',()=>{
        this.view.hide()
      })
      window.eventHub.on('updatePlaylist',(data)=>{
        this.view.show()
        let playlists = this.model.data.playlists
        for(let i=0; i<playlists.length; i++){
          if(playlists[i].id === data.id){
            playlists[i] = data
          }
        }
        this.view.render(this.model.data)
      })
      window.eventHub.on('deleteList',()=>{
        this.view.hide()
      })
      window.eventHub.on('listDeleteCancel',()=>{
        this.view.show()
      })
      window.eventHub.on('listDeleteYes',(list)=>{
        this.view.show()
        this.model.delete(list).then(()=>{
          this.model.find().then(()=>{
            this.view.render(this.model.data)
            window.eventHub.emit('listDeleteDone',JSON.parse(JSON.stringify(this.model.data)))
          })
        })
      })
      window.eventHub.on('upload',()=>{
        this.view.hide()
      })
      window.eventHub.on('toListDetail',()=>{
        this.view.hide()
      })
    }
    
  }

  controller.init(view,model)
}