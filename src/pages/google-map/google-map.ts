import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,  AlertController, PopoverController } from 'ionic-angular';

declare var google;
// declare var cur_pos_lat;
// declare var cur_pos_lng;

/**
 * Generated class for the GoogleMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-google-map',
  templateUrl: 'google-map.html',
})
export class GoogleMapPage {


  @ViewChild('map') mapElement: ElementRef;
  map: any;
  public cur_pos_lat;
  public cur_pos_lng;
  place_name;
  callback;

  handong_place = [
    {
      title: 'OH',
      lat: 12112,
      lng: 2231
    },
    {
      title:'NTH',
      lat: 34234,
      lng: 34242
    }
  ]

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, 
    public navParams: NavParams, public popoverCtrl: PopoverController) {
    this.callback = this.navParams.get('callback');
  }


  ionViewDidLoad() {

    var temp_lat, temp_lng;
    //var bounds = new google.maps.LatLngBounds();
    var map = new google.maps.Map(this.mapElement.nativeElement, {
        center: {lat: -34.397, lng: 150.644},
        zoom: 15
      });

    var infoWindow = new google.maps.InfoWindow();
    var pos;
    var marker = new google.maps.Marker();

   // if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
       
        console.log(pos.lat);
        
        map.setCenter(pos);

        marker.setPosition(pos);
        marker.setMap(map);
        marker.setDraggable(true);
  
    marker.addListener('dragend', function(e) {
      marker.lat = e.latLng.lat();
      marker.lng = e.latLng.lng();
      // temp_lat = marker.lat;
      // temp_lng = marker.lng;

      this.map.setZoom(18);
      //this.map.setCenter(marker.getPosition());
      //infoWindow.setContent(marker.lat+','+marker.lng+'<br>'+'<button ion-button block onclick= "alertText()">Add</button>');
      infoWindow.setContent(marker.lat+','+marker.lng);
      infoWindow.open(this.map, marker);
      
      console.log('marker:'+marker.lat);

    });
    


    marker.addListener('dblclick',function(j) {

      // this.cur_pos_lat = temp_lat;
      // this.cur_pos_lng = temp_lng;
      // console.log('this??'+this.cur_pos_lat);
      // this.setTitle();

      temp_lat = marker.lat;
      temp_lng = marker.lng;
      console.log('this??'+temp_lat);


      // this.cur_pos_lat = temp_lat;
      // this.cur_pos_lng = temp_lng;
      // console.log('cur'+this.cur_pos_lat);
         
  });
  });

  this.cur_pos_lat = temp_lat;
  this.cur_pos_lng = temp_lng;
  console.log('cur'+this.cur_pos_lat);
}
setHandongPlace(){
  let popover = this.popoverCtrl.create('dfdf');
  popover.present();
  console.log('dd');
}

//차선책으로, 직접 위도경도를 입력하게 함...
setTitle(){
    let prompt = this.alertCtrl.create({
      title: '장소명',
      message: "장소명과 좌표를 뒤에보고 입력해줘라ㅠㅠ 받아올수가없어서 미안",
      inputs: [
        {
          name:'title',
          placeholder: 'place name'
        },
        {
          name:'p_lat',
          placeholder: '위도'
        },
        {
          name:'p_lng',
          placeholder: '경도'
        }
      ],
      buttons:[
        {
          text:'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'complete',
          handler: data => {
            
            if (data.title != '') {
  
              this.place_name = data.title;
              this.cur_pos_lat = data.p_lat;
              this.cur_pos_lng = data.p_lng;
              this.callback([
                this.place_name, this.cur_pos_lat, this.cur_pos_lng 
              ]).then(()=>{
                this.navCtrl.pop();
              })



              //아니아니, 일단은 이 정보가 matching-time으로 넘어가서,
              //거기서 complete를 할때 정보가 최종으로 push 되어야함.
              console.log(this.place_name);

              //화면종료해야함
              
              }
            }
          }
      ]
    });
  
    prompt.present();
    
  }


  // setTitle(){
  //   var ll = this.cur_pos_lat;
  //   var gg = this.cur_pos_lng;
    
  //     console.log('제발'+ll);
  //     let prompt = this.alertCtrl.create({
  //       title: '장소명',
  //       message: "장소명을 입력해라",
  //       inputs: [
  //         {
  //           name:'title',
  //           placeholder: 'place name'
  //         }
  //       ],
  //       buttons:[
  //         {
  //           text:'Cancel',
  //           handler: data => {
  //             console.log('Cancel clicked');
  //           }
  //         },
  //         {
  //           text: 'complete',
  //           handler: data => {
              
  //             if (data.title != '') {

  //               console.log('너네들어갔자나!!'+ll);
    
  //               this.place_name = data.title;
  //               this.callback([
  //                 this.place_name, this.cur_pos_lat, this.cur_pos_lng 
  //               ]).then(()=>{
  //                 this.navCtrl.pop();
  //               })



  //               //일단은 이 정보가 matching-time으로 넘어가서,
  //               //거기서 complete를 할때 정보가 최종으로 push 되어야함.
  //               console.log(this.place_name);

  //               //화면종료해야함
                
  //               }
  //             }
  //           }
  //       ]
  //     });
    
  //     prompt.present();
      
  //   }

  

}
