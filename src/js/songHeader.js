{
  let view = {
    el: 'header',
    template: `
     <p>歌曲列表</p>
    `,
    render(data){
      $(this.el).html(this.template)
    },
    createNewSong(){
      $(this.el).find('p').text('新建歌曲')
    },
    SongList(){
      $(this.el).find('p').text('歌曲列表')
    },
    editSong(){
      $(this.el).find('p').text('编辑歌曲')
    },
    deleteSong(){
      $(this.el).find('p').text('删除歌曲')
    }
  }

  let model = {}

  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)

      window.eventHub.on('upload',()=>{
        this.view.createNewSong()
      })

      window.eventHub.on('create',()=>{
        this.view.SongList()
      })

      window.eventHub.on('cancel',()=>{
        this.view.SongList()
      })

      window.eventHub.on('edit',()=>{
        this.view.editSong()
      })

      window.eventHub.on('update',()=>{
        this.view.SongList()
      })

      window.eventHub.on('delete',()=>{
        this.view.deleteSong()
      })

      window.eventHub.on('deleteCancel',()=>{
        this.view.SongList()
      })

      window.eventHub.on('deleteSong',()=>{
        this.view.SongList()
      })
    }
  }

  controller.init(view,model)
}