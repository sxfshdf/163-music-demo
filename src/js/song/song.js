

{
  let view = {
    el: '.page',
    init() {
      this.$el = $(this.el)
    },
    render(data) {
      this.$el.find('.imageWrapper>img').attr('src', data.cover)
      this.$el.find('.background').css('background-image', `url(${data.cover})`)
      this.$el.find('.songName').text(data.name)
      this.$el.find('.singer').text(data.singer)
      if(this.$el.find('audio').attr('src') !== data.url){
        this.$el.find('audio').attr('src', data.url)
        let audio = this.$el.find('audio')[0]
        audio.onended = ()=>{
          window.eventHub.emit('songEnded')
        }
        audio.ontimeupdate = ()=>{this.showLyric(audio.currentTime)}
      }
      if(data.audioStatus === 'paused'){
        this.$el.find('.imageWrapper').removeClass('playing')
      }else{
        this.$el.find('.imageWrapper').addClass('playing')
      }
      let allP = this.$el.find('.lines>p')
      if(allP.length <= 1){
        let lyric = data.lyric
        let lyricObject = {}
        lyric.split('\n').map((line)=>{
          let times = line.match(/\d{2}:\d{2}/g)
          let string = line.replace(/\[.+?\]/g, '')
          if(Array.isArray(times)){
            times.map((time)=>{
              lyricObject[time] = string
              if(string){
                let $p = $(`<p data-time = "${time}">${string}</p>`)
                this.$el.find('.lines').append($p)
              }
            })
          }
        })
      }
    },
    play() {
      this.$el.find('audio')[0].play()
      this.$el.find('.play.active').removeClass('active')
      this.$el.find('.pause').addClass('active')
    },
    pause() {
      this.$el.find('audio')[0].pause()
      this.$el.find('.play').addClass('active')
      this.$el.find('.pause.active').removeClass('active')
    },
    showLyric(time){
      let minute = Math.floor(time/60) + ''
      let second = Math.floor(time%60) + ''
      second = second.length === 2? second : '0'+second
      minute = minute.length === 2? minute : '0'+minute
      let currentTime = minute + ':' + second
      // console.log(currentTime)
      let allP = this.$el.find('.lines>p')
      for(let i=0; i<allP.length; i++){
        if( $(allP[i]).attr('data-time') === currentTime){
          $(allP[i]).addClass('active').siblings('.active')
          .removeClass('active')
          this.$el.find('.lines').css({transform: 'translateY('+(-24*(i-1))+'px)'})
          break
        }
        
      }
    }
  }

  let model = {
    data: {
      audioStatus: 'paused'
    },
    getSong() {
      let query = new AV.Query('Song')
      return query.get(this.data.id).then((newSong) => {
        Object.assign(this.data, newSong.attributes)
        return newSong
      })
    },
    
  }

  let controller = {
    init(view, model) {
      this.model = model
      this.view = view
      this.view.init()
      this.getSongId()
      this.model.getSong(this.model.data.id).then(() => {
        this.view.render(this.model.data)
      })
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents() {
      this.view.$el.find('.clickArea').on('click', (e) => {
        if (this.model.data.audioStatus === 'paused'){
          this.model.data.audioStatus = 'playing'
          this.view.render(this.model.data)
          this.view.play()
        }else{
          this.model.data.audioStatus = 'paused'
          this.view.render(this.model.data)
          this.view.pause()
        }
      })
    },
    bindEventHub(){
      window.eventHub.on('songEnded',()=>{
        this.model.data.audioStatus = 'paused'
        this.view.render(this.model.data)
        this.view.pause()
      })
    },
    getSongId() {
      let search = window.location.search
      if ('?'.indexOf(search) === -1) {
        search = search.substring(1)
      }
      let search1 = search.split('&').filter((v => v))
      let id
      for (let i = 0; i < search1.length; i++) {
        let hash = search1[i].split('=')
        let key = hash[0]
        let value = hash[1]
        if (key === 'id') {
          id = value
        }
      }
      this.model.data.id = id
    }
  }

  controller.init(view, model)
}