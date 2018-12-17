{
  let view = {
    el: '.head',
    init(){
      this.$el = $(this.el)
    },
    template: `
      <div class="image-container">
      <div class="mount">
        <span class="fas fa-headphones headphone"></span>
        <span class="number">100.5万</span>
      </div>
      <div class="image">
      </div>
      </div>
      <div class="songInfo">
        <p class="name">{{name}}</p>
        <div class="creator">
          <div class="creatorImg">
          </div>
          <p class="creatorName">Admin</p>
        </div>
      </div>
    `,
    render(data={}){
      let html = this.template
      html = html.replace('{{name}}',data.name || '')
      this.$el.html(html)
      this.$el.find('.image').css('background-image',`url(${data.cover})`)
    }
  }

  let model = {
    data:{},
    findList(){
      let query = new AV.Query('Playlist')
      return query.get(this.data.id).then((playlist) => {
        Object.assign(this.data, playlist.attributes)
        return playlist
      })
    }
  }

  let controller = {
    init(view,model){
      this.view = view
      this.view.init()
      this.model = model
      this.getListId()
      this.model.findList().then(()=>{
        this.view.render(this.model.data)
      })
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents(){
      
    },
    bindEventHub(){
      window.eventHub.on('selectList',(data)=>{
        this.view.render(data)
      })
    },
    getListId(){
      let search = window.location.search
      if(search.indexOf('?') === 0){
        search = search.substring(1)
      }
      let array = search.split('&').filter((v=>v))
      let id
      for(let i=0; i<array.length; i++){
        let hash = array[i].split('=')
        let key = hash[0]
        let value = hash[1]
        if(key === 'id'){
          id = value
        }
      }
      this.model.data.id = id
    }
  }

  controller.init(view,model)
}