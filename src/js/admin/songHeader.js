{
  let view = {
    el: 'header',
    template: `
    <div class="headerWrapper">
     <p>主页</p>
     <button class="createList">创建歌单</d>
     </div>
    `,
    render(data) {
      $(this.el).html(this.template)
    },
    createNewSong() {
      $(this.el).find('p').text('新建歌曲')
    },
    SongList() {
      $(this.el).find('p').text('歌曲列表')
    },
    editSong() {
      $(this.el).find('p').text('编辑歌曲')
    },
    deleteSong() {
      $(this.el).find('p').text('删除歌曲')
    },
    homePage(){
      $(this.el).find('p').text('主页')
    },
    allSongList(){
      $(this.el).find('p').text('歌单列表')
      $(this.el).find('.createList').css('display','block')
    }
  }

  let model = {}

  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents(){
      console.log($(this.view.el).find('button.createList'))
      $(this.view.el).on('click','.createList',(e)=>{
        window.eventHub.emit('createList')
      })
    },
    bindEventHub() {
      window.eventHub.on('upload', () => {
        this.view.createNewSong()
      })

      window.eventHub.on('create', () => {
        this.view.SongList()
      })

      window.eventHub.on('cancel', () => {
        this.view.SongList()
      })

      window.eventHub.on('edit', () => {
        this.view.editSong()
      })

      window.eventHub.on('update', () => {
        this.view.SongList()
      })

      window.eventHub.on('delete', () => {
        this.view.deleteSong()
      })

      window.eventHub.on('deleteCancel', () => {
        this.view.SongList()
      })

      window.eventHub.on('deleteSong', () => {
        this.view.SongList()
      })
      window.eventHub.on('selectTab',(tabName)=>{
        if(tabName === 'home'){
          this.view.homePage()
          $(this.view.el).find('.createList').css('display','none')
          
        }else if(tabName === 'songList'){
          this.view.SongList()
          $(this.view.el).find('.createList').css('display','none')
          
        }else if(tabName === 'song'){
          this.view.allSongList()
          $(this.view.el).siblings().css('display','none').siblings('header').css('display','block')
        }
      })
      window.eventHub.on('createList',()=>{
        $(this.view.el).find('.createList').css('display','none')
        
      })
    }
  }

  controller.init(view, model)
}