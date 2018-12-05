{
  let view = {
    el: '.newSong',
    template: `
      <form>
        <div class="raw">
          <label for="name">歌名</label>
          <input type="text" id="name" name="name" value="__key__">
        </div>
        <div class="raw">
          <label for="singer">歌手</label>
          <input type="text" id="singer" name="singer" value="">
        </div>
        <div class="raw">
          <label for="url">外链</label>
          <input type="text" id="url" name="url" value="__link__">
        </div>
        <div class="raw actions">
          <button class="save" type="sumit">保存</button>
          <button id="cancel" class="cancel" type="button">取消</button>
        </div>
      </form>
    `,
    render(data = {}){
      
      let placeHolder = ['key','link']
      let html = this.template
      placeHolder.map((string)=>{
        html = html.replace(`__${string}__`, data[string] || '')
      })
      $(this.el).html(html)

    },
    showNewSong(){
      $(this.el).css('display','block')
    },
    hideNewSong(){
      $(this.el).css('display','none')
    }
  }

  let model = {}

  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()

      window.eventHub.on('upload',(data)=>{
        this.view.showNewSong()
        this.view.render(data)
      })

      window.eventHub.on('cancel',()=>{
        this.view.hideNewSong()
      })

      
    },
    bindEvents(){
      let $el = $(this.view.el)
      $el.on('click','#cancel',(e)=>{
        e.preventDefault()
        window.eventHub.emit('cancel')
      })
    }

    
  }

  controller.init(view,model)
}