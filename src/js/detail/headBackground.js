{
  let view = {
    el:'.bg',
    template: `
      <div class="background">
      </div>
    `,
    render(data){
      $(this.el).html(this.template)
      $(this.el).find('.background').css('background-image',`url(${data.cover})`)
    }
  }

  let model = {
    data: {},
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
      this.model = model
      this.getListId()
      this.model.findList().then(()=>{
        this.view.render(this.model.data)
      })
      this.bindEvents()
      
    },
    bindEvents(){},
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