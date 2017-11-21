import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController } from 'ionic-angular';

declare var google;

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
  cur_pos_lat;
  cur_pos_lng;
  place_name;
  callback;

  // handong_place = [
  //   {
  //     title: 'OH',
  //     lat: 12112,
  //     lng: 2231
  //   },
  //   {
  //     title: 'NTH',
  //     lat: 34234,
  //     lng: 34242
  //   }
  // ]

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
    public navParams: NavParams, public popoverCtrl: PopoverController) {
    this.callback = this.navParams.get('callback');
  }


  ionViewDidLoad() {

    var getThis = this;

    var temp_lat, temp_lng;
    //var bounds = new google.maps.LatLngBounds();
    var map = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 15
    });

    var infoWindow = new google.maps.InfoWindow();
    var pos;
    var marker = new google.maps.Marker();

    // if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      console.log(pos.lat);

      map.setCenter(pos);

      marker.setPosition(pos);
      marker.setMap(map);
      marker.setDraggable(true);

      marker.addListener('dragend', function (e) {
        marker.lat = e.latLng.lat();
        marker.lng = e.latLng.lng();

        this.map.setZoom(18);
        //this.map.setCenter(marker.getPosition());
        //infoWindow.setContent(marker.lat+','+marker.lng+'<br>'+'<button ion-button block onclick= "alertText()">Add</button>');
        infoWindow.setContent(marker.lat + ',' + marker.lng);
        infoWindow.open(this.map, marker);

        getThis.cur_pos_lat = marker.lat;
        getThis.cur_pos_lng = marker.lng;
        console.log('marker:' + marker.lat);

      });
    });
    console.log('cur' + this.cur_pos_lat);
  }

  // setHandongPlace() {
  //   let popover = this.popoverCtrl.create('dfdf');
  //   popover.present();
  //   console.log('dd');
  // }

  setTitle() {
    var ll = this.cur_pos_lat;
    var gg = this.cur_pos_lng;

    console.log('제발' + ll);
    let prompt = this.alertCtrl.create({
      title: '장소명',
      message: "장소명을 입력해라",
      inputs: [
        {
          name: 'title',
          placeholder: 'place name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'complete',
          handler: data => {

            if (data.title != '') {

              console.log('너네들어갔자나!!' + ll);

              this.place_name = data.title;
              this.callback([
                this.place_name, this.cur_pos_lat, this.cur_pos_lng
              ]).then(() => {
                this.navCtrl.pop();
              })

              //일단은 이 정보가 matching-time으로 넘어가서,
              //거기서 complete를 할때 정보가 최종으로 push 되어야함.
              console.log(this.place_name);

            }
          }
        }
      ]
    });

    prompt.present();

  }



}
