{
  let view = {
    el: '.listDelete',
    template: `
      <div class="deleteList">
      <div class="delete-content">
        <p>确定要删除歌单 <span class="strong">__name__</span> 吗？</p>
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
    showDeleteList(){
      $(this.el).css('display','block')
    },
    hideDeleteList(){
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
      this.bindEventHub()
    },
    bindEvents(){
      $(this.view.el).on('click','.cancel',(e)=>{
        e.preventDefault()
        this.view.hideDeleteList()
        window.eventHub.emit('listDeleteCancel')
      })

      $(this.view.el).on('submit','form',(e)=>{
        e.preventDefault()
        this.view.hideDeleteList()
        window.eventHub.emit('listDeleteYes',this.model.data)
      })
    },
    bindEventHub(){
      window.eventHub.on('deleteList',(data)=>{
        this.view.showDeleteList()
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('upload',()=>{
        this.view.hideDeleteList()
      })
    }
    
    
  }

  controller.init(view,model)
}