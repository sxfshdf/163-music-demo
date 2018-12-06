{
  let view = {
    el: '.songDelete',
    template: `
      <div class="deleteSong">
      <div class="delete-content">
        <p>确定要删除歌曲 <span class="strong">__name__</span> 吗？</p>
        <form class="actions">
          <button type = "submit" class="delete">确定</button>
          <button type = "button" class="cancel">取消</button>
          </form>
        </div>
      </div>
    `,
    render(data={}){ 
      let html = this.template
      html = html.replace('__name__',data.name)
      $(this.el).html(html)
    },
    showDeleteSong(){
      $(this.el).css('display','block')
    },
    hideDeleteSong(){
      $(this.el).css('display','none')
    }
  }

  let model = {
    data: {}
  }

  let controller = {
    init(view,model){
      this.model = model
      this.view = view
      this.view.render()
      this.bindEvents()
      window.eventHub.on('delete',(data)=>{
        this.view.showDeleteSong()
        this.model.data = data
        this.view.render(this.model.data)
      })
    },
    bindEvents(){
      $(this.view.el).on('click','.cancel',(e)=>{
        e.preventDefault()
        this.view.hideDeleteSong()
        window.eventHub.emit('deleteCancel')
      })

      $(this.view.el).on('submit','form',(e)=>{
        e.preventDefault()
        this.view.hideDeleteSong()
        window.eventHub.emit('deleteSong',this.model.data)
      })
    }
    
  }

  controller.init(view,model)
}