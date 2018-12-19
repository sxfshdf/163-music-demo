{
  let view = {
    el: '.songLoadingWrapper',
    template: `
      <img class="songLoading" src="./img/songLoading.gif" alt="">
    `,
    render(){
      $(this.el).html(this.template)
    },
    show(){
      $(this.el).addClass('active')
    },
    hide(){
      $(this.el).removeClass('active')
    }
  }

  let controller = {
    init(view){
      this.view = view
      this.view.render()
      this.bindEventHub()
    },
    bindEventHub(){
      window.eventHub.on('songOnLoad',()=>{
        this.view.show()
      })
      window.eventHub.on('songLoaded',()=>{
        this.view.hide()
      })
    }
  }

  controller.init(view)
}