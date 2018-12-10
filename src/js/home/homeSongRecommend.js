{
  let view = {
    el: '.songRecommend',
    template: `
      <p class="listName">最新音乐</p>
      <ul class="songList">
      </ul>
    `,
    render(data){
      let {songs} = data
      $(this.el).html(this.template)
      songs.map((song)=>{
        let $li = $(`
          <li class="song">
            <a href="./song.html?id=${song.id}">
              <div class="songInfo">
                <p class="songName">${song.name}</p>
                <p class="singer">${song.singer}</p>
              </div>
              <div class="playIcon">
                <i class="fas fa-play play"></i>
              </div>
            </a>
          </li>
        `)
        
        $(this.el).find('ul.songList').append($li)
      })
    }
  }

  let model = {
    data:{
      songs:[]
    },
    find() {
      let query = new AV.Query('Song')
      query.descending('updatedAt')
      query.limit(10)
      return query.find().then((songs) => {
        this.data.songs = songs.map((song) => {
          let songs = { id: song.id, ...song.attributes }
          return songs
        })
        return songs
      })
    },
  }

  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.model.find().then(()=>{
        this.view.render(this.model.data)
      })
    }
  }

  controller.init(view,model)
}