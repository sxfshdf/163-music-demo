{
  let view = {
    el: '.topHead',
    template: `
      <img src="./img/music-colored.svg" alt="" class="logo">
      <button class="download">下载App</button>
    `,
    render(){
      $(this.el).html(this.template)
    }
  }

  let model = {}

  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
    }
  }

  controller.init(view,model)
}