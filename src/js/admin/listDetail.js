{
  let view = {
    el: '.listDetail',
    template: `
      <div class="wrapper">
        <div class="listHead">
          
        </div>
        <div class="allSongs">
          
        </div>
      </div>
    `,
    render(){
      $(this.el).html(this.template)
    },
    show() {
      $(this.el).css('display', 'block')
    },
    hide() {
      $(this.el).css('display', 'none')
    }
  }

  let model = {
    data: {}
  }
  let controller = {
    init(view, model) {
      this.model = model
      this.view = view
      this.view.render()
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents() {

    },
    bindEventHub() {
      window.eventHub.on('toListDetail', () => {
        this.view.show()
      })
      window.eventHub.on('upload', () => {
        this.view.hide()
      })
      window.eventHub.on('addSongs', () => {
        this.view.hide()
      })
      window.eventHub.on('addSongDone',()=>{
        this.view.show()
      })
      window.eventHub.on('addSongCancel',()=>{
        this.view.show()
      })
      window.eventHub.on('homeToDetail',()=>{
        this.view.show()
      })
    }
  }

  controller.init(view, model)
}