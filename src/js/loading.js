{
  let view = {
    el: '.loadingContainer',
    template: `
      <div class="loading">
        <img src="./img/loading.gif" alt="">
      </div>
    `,
    render(){
      $(this.el).html(this.template)
    },
    showLoading(){
      $(this.el).css('display','block')
    },
    hideLoading(){
      $(this.el).css('display','none')
    }
  }

  let model = {}

  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.view.render()
      this.bindEventHub()
    },
    bindEventHub(){
      window.eventHub.on('beforeUploaded',()=>{
        this.view.showLoading()
      })
      window.eventHub.on('afterUploaded',()=>{
        this.view.hideLoading()
      })
    }
  }

  controller.init(view,model)
}