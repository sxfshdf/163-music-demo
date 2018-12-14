{
  let view = {
    el: '.newSongList',
    template: `
      <form>
        <div class="raw">
          <label for="songListName">歌单名称</label>
          <input type="text" id="songListName" name="songListName" value="__songListName__">
        </div>
        <div class="raw">
          <label class="listDescription" for="listDescription">歌单简介</label>
          <textarea rows="8" id="listDescription" name="listDescription">__listDescription__</textarea>
        </div>
        <div class="raw actions">
          <button class="save" type="sumit">保存</button>
          <button id="cancel" class="cancel" type="button">取消</button>
        </div>
      </form>
    `,
    render(data = {}) {
      $(this.el).html(this.template)

    },
    showNewSongList() {
      $(this.el).css('display', 'block')
    },
    hideNewSongList() {
      $(this.el).css('display', 'none')
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

    bindEvents() {
   
    },
    bindEventHub(){
      window.eventHub.on('createList',()=>{
          this.view.showNewSongList()
      })
    }
    
  }

  controller.init(view, model)
}