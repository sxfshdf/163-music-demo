{
  let view = {
    el: 'header',
    template: `
     <p>歌曲列表</p>
    `,
    render(data){
      $(this.el).html(this.template)
    },
    changeHeadName(){
      $(this.el).find('p').text('新建歌曲')
    }
  }

  let model = {}

  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)

      window.eventHub.on('upload',()=>{
        this.view.changeHeadName()
      })
    }
  }

  controller.init(view,model)
}