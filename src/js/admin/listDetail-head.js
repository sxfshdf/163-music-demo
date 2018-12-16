{
  let view = {
    el: '.listHead',
    template: `
    <img class="listCover" src="__url__" alt="">
    <div class="listInfo">
      <p class="listName">__name__</p>
      <p class="listCreator">admin</p>
      <div class="timeInfo">
        <p class="create">创建时间 : __createTime__<p>
        <p class="update">更新时间 : __updateTimeTime__<p>
      </div>
    </div>
    `,
    render(data={}){
      let html = this.template
      html = html.replace('__url__',data.cover || '').replace('__name__',data.name || '')
      .replace('__createTime__',data.createTime).replace('__updateTimeTime__',data.updateTime)
      $(this.el).html(html)
    }
  }

  let model = {
    data: {
      playlist:''
    },
    
  }

  let controller = {
    init(view, model) {
      this.model = model
      this.view = view
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents() {

    },
    bindEventHub() {
      window.eventHub.on('toListDetail', (playlist) => {
        this.model.data.playlist = playlist
        this.view.render(this.model.data.playlist)
      })
      window.eventHub.on('homeToDetail', (playlist) => {
        this.model.data.playlist = playlist
        this.view.render(this.model.data.playlist)
      })
    }
  }

  controller.init(view, model)
}