{
  let view = {
    el: '.allSongList',
    init(){
      this.$el = $(this.el)
    },
    render(){},
    show(){
      this.$el.css('display','block')
    },
    hide(){
      this.$el.css('display','none')
    }
  }

  let model = {}

  let controller = {
    init(view,model){
      this.view = view
      this.view.init()
      this.model = model
      this.view.render()
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents(){
      
    },
    bindEventHub(){
      window.eventHub.on('selectTab',(tabName)=>{
        if(tabName === 'song'){
          this.view.show()
          $(this.view.el).siblings().css('display','none').siblings('header').css('display','block')
        }else{
          this.view.hide()
        }
      })
      window.eventHub.on('createList',()=>{
        this.view.hide()
      })
    }
    
  }

  controller.init(view,model)
}