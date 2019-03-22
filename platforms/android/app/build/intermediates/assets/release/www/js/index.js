/*
** PingSmart wali
** Bandung 1 Jan 2019
*/

var appwali =  angular.module('app', ['onsen','ipCookie','highcharts-ng','ngRoute','angular-md5','angular-loading-bar','ngSanitize']);


//server
var _URL        = "http://smartschool.trilogi-solution.com/api/";
var BASE_URL        = "http://smartschool.trilogi-solution.com";

//local
//var _URL        = "http://localhost:7777/apismart/api/";
//var BASE_URL        = "http://localhost:7777/apismart";


var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        //var Permission = window.plugins.Permission;
    },
    receivedEvent: function(id) {

        member_id_wali  = window.localStorage.getItem("member_id_wali");
        token_wali     = window.localStorage.getItem("token_wali");

            if (member_id_wali == '' || member_id_wali == null || token_wali == '' || token_wali == null) {
                fn.load('landing-page.html');
                return false;
            } else {
                fn.load('dashboard.html');
            }
    }
};

//config loading bar
appwali.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.latencyThreshold = 400;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.includeBar = true;
  }]);

appwali.controller('getCurrentInfoWeek', ['$scope', '$http','ipCookie', function($scope, $http,ipCookie) {

    //Data Msg
    $scope.data = {
           msg: '',
           nis: ''
    };

    //Date 
    $scope.date = new Date();

    $scope.logout = function(){
        window.localStorage.removeItem("member_id_wali");
        window.localStorage.removeItem("token_wali");
        window.localStorage.removeItem("level");
        window.localStorage.removeItem("nama");
        window.localStorage.removeItem("jumsiswa");
        window.localStorage.removeItem("NIS");

        fn.load('landing-page.html');
    };

    $scope.refresh = function(){
        fn.load('dashboard.html');
    };

}]);


appwali.controller('PageController', ['$scope', '$http','ipCookie', 'md5', function($scope, $http, ipCookie, md5) {


    $scope.login = function(){

        function login_action() {
        
        //var device_id = device.uuid;
        var device_id = '12345678';

        var username = $scope.username;
        var password = $scope.password;


             $http.get( _URL+"auth-wali?user=" + username + "&pass=" + password)
             .success(function (response) {
                 if (response.response_code == 1) {

                    window.localStorage.setItem("member_id_wali", response.data[0].MemberId);
                    window.localStorage.setItem("token_wali", response.data[0].Token);
                    window.localStorage.setItem("level", response.data[0].Level);
                    window.localStorage.setItem("nama", response.data[0].Nama);
                    window.localStorage.setItem("jumsiswa", response.data[0].JumSiswa);

                    JumSiswa = response.data[0].JumSiswa;

                    //Login status
                    if(response.data[0].IsLogin == 0){

                        fn.load('change-password.html');

                    }else{

                        if (JumSiswa == 1) {

                              token_wali  = window.localStorage.getItem("token_wali");

                              $http.get( _URL+"show-my-child?token=" + token_wali)
                                  .success(function (response) {

                                  //---------------------SAVE LOCAL-----------------------
                                  window.localStorage.setItem("NIS", response.data[0].NIS);

                                  fn.load('dashboard.html');

                              });

                            }

                        fn.load('dashboard.html');

                    }

                    

                 } else if (response.response_code != 1) {
                    ons.notification.alert({
                      messageHTML: 'Username dan password yang anda kirimkan salah.',
                      title: 'Notifikasi',
                      buttonLabel: 'OK',
                      animation: 'default',
                      callback: function() {
                        // Alert button is closed!
                      }
                    });
                    return false;
                 }
             });

        }


        if ( $scope.username == undefined ) {
                ons.notification.alert({
                  messageHTML: 'Username Harus Diisi',
                  title: 'Notifikasi',
                  buttonLabel: 'OK',
                  animation: 'default', // or 'none'
                  // modifier: 'optional-modifier'
                  callback: function() {
                    // Alert button is closed!
                  }
                });
                
                return false;
            }

        if ( $scope.password == undefined ) {
                ons.notification.alert({
                  messageHTML: 'Password Harus Diisi',
                  title: 'Notifikasi',
                  buttonLabel: 'OK',
                  animation: 'default', // or 'none'
                  // modifier: 'optional-modifier'
                  callback: function() {
                    // Alert button is closed!
                  }
                });
                
                return false;
            }


        login_action();


    };


}]);

appwali.controller('PageChangePassword', ['$scope', '$http', function($scope, $http) {

    //formdata
    $scope.formData = {
      word: /^\s*\w*\s*$/
    };

    // Set the default value of inputType
    $scope.inputType = 'password';
    
    // Hide & show password function
    $scope.hideShowPassword = function(){
      if ($scope.inputType == 'password')
        $scope.inputType = 'text';
      else
        $scope.inputType = 'password';
    };


    $scope.changePasswords = function(){

        function change_action() {

            token_wali  = window.localStorage.getItem("token_wali");
            $scope.formData.token = token_wali;

            $http({ method  : 'POST',
                url     :  _URL+"change-password",
                data    : $.param($scope.formData),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }   
            })
            .success(function(response) {

                if (response.response_code == 1) {

                    ons.notification.alert({
                      messageHTML: 'Change Password Success',
                      title: 'Notifikasi',
                      buttonLabel: 'OK',
                      animation: 'default',
                      callback: function() {
                        // Alert button is closed!
                      }
                    });

                    fn.load('login.html');

                }

            });

        }

        if ( $scope.formData.password == undefined ) {
                ons.notification.alert({
                  messageHTML: 'Password Harus Diisi',
                  title: 'Notifikasi',
                  buttonLabel: 'OK',
                  animation: 'default', // or 'none'
                  // modifier: 'optional-modifier'
                  callback: function() {
                    // Alert button is closed!
                  }
                });
                
                return false;
            }

        change_action();

    
    }


}]);

appwali.controller('PageDashboard', ['$scope', '$http', function($scope, $http) {

  token_wali  = window.localStorage.getItem("token_wali");
  level  = window.localStorage.getItem("level");
  nama  = window.localStorage.getItem("nama");
  jumsiswa  = window.localStorage.getItem("jumsiswa");
  NIS  = window.localStorage.getItem("NIS");

  $scope.NIS = NIS;
  $scope.Nama = nama;
  $scope.Level = level;
  $scope.JumSiswa = jumsiswa;
  $scope.BASE_URL = BASE_URL;

  token_wali  = window.localStorage.getItem("token_wali");

  if(jumsiswa == 1) {

  $http.get( _URL+"siswa-profile-wali?nis=" + NIS + "&token=" + token_wali)
      .success(function (response) {

        $scope.Point = response.data[0].Point;
        $scope.Pelajaran = response.data[0].Pelajaran;
        $scope.JamPel = response.data[0].JamPel;
        //---------------------------------
        $scope.NISN = response.data[0].NISN;
        $scope.NamaSiswa = response.data[0].NamaSiswa;
        $scope.Kelas = response.data[0].Kelas;
        $scope.Lahir = response.data[0].Lahir;
        $scope.TglLahir = response.data[0].TglLahir;
        $scope.Agama = response.data[0].Agama;
        $scope.JumlahSiswa = response.data[0].JumlahSiswa;
        $scope.Rangking = response.data[0].Rangking;
        $scope.Avatar = response.data[0].Avatar;
        //--------------------------------
        $scope.URL_Avatar = BASE_URL + "/" + $scope.Avatar;

  });

  //Info Terkini
  $http.get( _URL+"siswa-pengumuman-wali-one?nis=" + NIS + "&token=" + token_wali)
        .success(function (response) {

        $scope.Id = response.data[0].Id;
        $scope.Judul = response.data[0].Judul;

    });

}else{

  $http.get( _URL+"show-my-child?token=" + token_wali)
        .success(function (response) {

          $scope.list_siswa = response.data;
    });

}
//------End
}]);

appwali.controller('PageDashboardSiswa', ['$scope', '$http', function($scope, $http) {

  token_wali  = window.localStorage.getItem("token_wali");
  nis_siswa   = $scope.data.msg;
  
  $scope.NIS = nis_siswa;
  $scope.Nama = nama;
  $scope.Level = level;
  $scope.JumSiswa = jumsiswa;
  $scope.BASE_URL = BASE_URL;

  $http.get( _URL+"siswa-profile-wali?nis=" + nis_siswa + "&token=" + token_wali)
      .success(function (response) {

        $scope.Point = response.data[0].Point;
        $scope.Pelajaran = response.data[0].Pelajaran;
        $scope.JamPel = response.data[0].JamPel;
        //---------------------------------
        $scope.NISN = response.data[0].NISN;
        $scope.NamaSiswa = response.data[0].NamaSiswa;
        $scope.Kelas = response.data[0].Kelas;
        $scope.Lahir = response.data[0].Lahir;
        $scope.TglLahir = response.data[0].TglLahir;
        $scope.Agama = response.data[0].Agama;
        $scope.JumlahSiswa = response.data[0].JumlahSiswa;
        $scope.Rangking = response.data[0].Rangking;
        $scope.Avatar = response.data[0].Avatar;
        //--------------------------------
        $scope.URL_Avatar = BASE_URL + "/" + $scope.Avatar;

  });

}]);

appwali.controller('PageJadwal', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.msg;

    $http.get( _URL+"siswa-jadwalwali?nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

        $scope.list_jadwal = response.data;

    });

}]);

appwali.controller('PageNilaiUlangan', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.msg;

    $http.get( _URL+"siswa-nilai-ulanganwali?nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

        $scope.list_nilai_ulangan = response.data;

    });

    this.showDialog = function(Id) {

      //variable detail nilai
        token_wali  = window.localStorage.getItem("token_wali");

        $http.get( _URL+"siswa-nilai-detailwali?id=" + Id + "&nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

            $scope.NIS = response.data[0].NIS;
            $scope.Nama = response.data[0].Nama;
            $scope.Tanggal = response.data[0].Tanggal;
            $scope.Jenis = response.data[0].Jenis;
            $scope.Pelajaran = response.data[0].Pelajaran;
            $scope.Nilai = response.data[0].Nilai;
            $scope.Minimal = response.data[0].Minimal;
            $scope.Status = response.data[0].Status;
            $scope.Keterangan = response.data[0].Keterangan;
            $scope.Penilai = response.data[0].Penilai;


        });

      if (this.dialog) {
        this.dialog.show();
      } else {
        
        $scope.Id = Id;
        ons.createElement('detail-nilai.html', { parentScope: $scope, append: true })
          .then(function(dialog) {
            this.dialog = dialog;
            dialog.show();
          }.bind(this));
      }
    }.bind(this);

}]);

appwali.controller('PageNilaiUts', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.msg;

    $http.get( _URL+"siswa-nilai-utswali?nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

        $scope.list_nilai_uts = response.data;

    });

    this.showDialog = function(Id) {

      //variable detail nilai
        token_wali  = window.localStorage.getItem("token_wali");

        $http.get( _URL+"siswa-nilai-detailwali?id=" + Id + "&nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

            $scope.NIS = response.data[0].NIS;
            $scope.Nama = response.data[0].Nama;
            $scope.Tanggal = response.data[0].Tanggal;
            $scope.Jenis = response.data[0].Jenis;
            $scope.Pelajaran = response.data[0].Pelajaran;
            $scope.Nilai = response.data[0].Nilai;
            $scope.Minimal = response.data[0].Minimal;
            $scope.Status = response.data[0].Status;
            $scope.Keterangan = response.data[0].Keterangan;
            $scope.Penilai = response.data[0].Penilai;


        });

      if (this.dialog) {
        this.dialog.show();
      } else {

        ons.createElement('detail-nilai.html', { parentScope: $scope, append: true })
          .then(function(dialog) {
            this.dialog = dialog;
            dialog.show();
          }.bind(this));
      }
    }.bind(this);

}]);

appwali.controller('PageNilaiUas', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.msg;

    $http.get( _URL+"siswa-nilai-uaswali?nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

        $scope.list_nilai_uas = response.data;

    });

    this.showDialog = function(Id) {

      //variable detail nilai
        token_wali  = window.localStorage.getItem("token_wali");

        $http.get( _URL+"siswa-nilai-detailwali?id=" + Id + "&nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

            $scope.NIS = response.data[0].NIS;
            $scope.Nama = response.data[0].Nama;
            $scope.Tanggal = response.data[0].Tanggal;
            $scope.Jenis = response.data[0].Jenis;
            $scope.Pelajaran = response.data[0].Pelajaran;
            $scope.Nilai = response.data[0].Nilai;
            $scope.Minimal = response.data[0].Minimal;
            $scope.Status = response.data[0].Status;
            $scope.Keterangan = response.data[0].Keterangan;
            $scope.Penilai = response.data[0].Penilai;


        });

      if (this.dialog) {
        this.dialog.show();
      } else {
      
        ons.createElement('detail-nilai.html', { parentScope: $scope, append: true })
          .then(function(dialog) {
            this.dialog = dialog;
            dialog.show();
          }.bind(this));
      }
    }.bind(this);

}]);

appwali.controller('PageNilaiRaport', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.msg;

    $http.get( _URL+"siswa-nilai-raport?nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

        $scope.list_nilai_raport = response.data;

    });

    this.showDialog = function(Id) {

      //variable detail nilai
        token_wali  = window.localStorage.getItem("token_wali");

        $http.get( _URL+"siswa-nilai-detailwali?id=" + Id + "&nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

            $scope.NIS = response.data[0].NIS;
            $scope.Nama = response.data[0].Nama;
            $scope.Tanggal = response.data[0].Tanggal;
            $scope.Jenis = response.data[0].Jenis;
            $scope.Pelajaran = response.data[0].Pelajaran;
            $scope.Nilai = response.data[0].Nilai;
            $scope.Minimal = response.data[0].Minimal;
            $scope.Status = response.data[0].Status;
            $scope.Keterangan = response.data[0].Keterangan;
            $scope.Penilai = response.data[0].Penilai;


        });

      if (this.dialog) {
        this.dialog.show();
      } else {

        ons.createElement('detail-nilai.html', { parentScope: $scope, append: true })
          .then(function(dialog) {
            this.dialog = dialog;
            dialog.show();
          }.bind(this));
      }
    }.bind(this);

}]);

appwali.controller('PageAgenda', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.msg;

    $scope.nis_siswa = nis_siswa;

    $http.get( _URL+"siswa-agenda-wali?nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

        $scope.list_agenda = response.data;

    });

}]);

appwali.controller('PageAgendaDetail', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.nis;

    $scope.nis_siswa = nis_siswa;

    $http.get( _URL+"siswa-agenda-wali-detail?token=" + token_wali +"&id="+ $scope.data.msg)
        .success(function (response) {

        $scope.TglAwal = response.data[0].TglAwal;
        $scope.TglAkhir = response.data[0].TglAkhir;
        $scope.JamAwal = response.data[0].JamAwal;
        $scope.JamAkhir = response.data[0].JamAkhir;
        $scope.Judul = response.data[0].Judul;
        $scope.Deskripsi = response.data[0].Deskripsi;

    });

}]);

appwali.controller('PageAkademik', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.msg;

    $http.get( _URL+"siswa-akademik?token=" + token_wali)
        .success(function (response) {

        $scope.list_akademik = response.data;

    });

}]);

appwali.controller('PageAkademikDetail', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.msg;

    $http.get( _URL+"siswa-akademik-detail?token=" + token_wali +"&id=" + $scope.data.msg)
        .success(function (response) {

        $scope.Tanggal = response.data[0].Tanggal;
        $scope.Event = response.data[0].Event;
        $scope.Tempat = response.data[0].Tempat;
        $scope.Deskripsi = response.data[0].Deskripsi;
        $scope.Status = response.data[0].Status;
        $scope.Keterangan = response.data[0].Keterangan;

    });

}]);

appwali.controller('PagePengumuman', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.msg;

    $scope.nis_siswa = nis_siswa;

    $http.get( _URL+"siswa-pengumuman-wali?nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

        $scope.list_pengumuman = response.data;

    });

}]);

appwali.controller('PagePengumumanDetail', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    id  = $scope.data.msg;
    nis_siswa  = $scope.data.nis;

    $scope.nis_siswa = nis_siswa;

    $http.get( _URL+"pengumuman-view?nis=" + nis_siswa + "&id=" + id +"&token=" + token_wali)
        .success(function (response) {

        $scope.Tanggal = response.data[0].Tanggal;
        $scope.Judul = response.data[0].Judul;
        $scope.Pengumuman = response.data[0].Pengumuman;
        $scope.BeginPublish = response.data[0].BeginPublish;
        $scope.EndPublish = response.data[0].EndPublish;

    });

}]);

appwali.controller('PageAlbum', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.msg;

    $scope.nis_siswa = nis_siswa;

    $scope.BASE_URL = BASE_URL;

    $http.get( _URL+"siswa-album-wali?nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

        $scope.list_album = response.data;

    });

}]);  

appwali.controller('PageAlbumDetail', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    id  = $scope.data.msg;

    nis_siswa  = $scope.data.nis;

    $scope.nis_siswa = nis_siswa;

    $scope.BASE_URL = BASE_URL;

    $http.get( _URL+"siswa-album-detail?token=" + token_wali +"&id="+ id)
        .success(function (response) {


        $scope.list_album_detail = response.data;

    });

    this.showDialog = function(Id) {

      if(Id != '') {

            //variable detail nilai
            token_wali  = window.localStorage.getItem("token_wali");

            $http.get( _URL+"siswa-album-detail-view?token=" + token_wali +"&id="+ Id)
            .success(function (response) {

                $scope.Image = response.data[0].Image;


            });

        }

      if (this.dialog) {
        this.dialog.show();
      } else {

        ons.createElement('detail-album-view.html', { parentScope: $scope, append: true })
          .then(function(dialog) {
            this.dialog = dialog;
            dialog.show();
          }.bind(this));
      }
    }.bind(this);

}]);

appwali.controller('PagePelanggaran', ['$scope', '$http', function($scope, $http) {

    token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.msg;

    $http.get( _URL+"siswa-pelanggaran-wali?nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

        $scope.list_pelanggaran = response.data;

    });

    this.showDialog = function(Id) {

      //variable detail nilai
        token_wali  = window.localStorage.getItem("token_wali");

        $http.get( _URL+"siswa-pelanggaran-wali-detail?token=" + token_wali +"&id=" + Id)
        .success(function (response) {

        $scope.Nama = response.data[0].Nama;
        $scope.Kelas = response.data[0].Kelas;
        $scope.Tanggal = response.data[0].Tanggal;
        $scope.Pelanggaran = response.data[0].Pelanggaran;
        $scope.Kategori = response.data[0].Kategori;
        $scope.Poin = response.data[0].Poin;
        $scope.Pelapor = response.data[0].Pelapor;
        $scope.Keterangan = response.data[0].Keterangan;

    });

      if (this.dialog) {
        this.dialog.show();
      } else {
        
        $scope.Id = Id;
        ons.createElement('detail-pelanggaran.html', { parentScope: $scope, append: true })
          .then(function(dialog) {
            this.dialog = dialog;
            dialog.show();
          }.bind(this));
      }
    }.bind(this);

}]);

//Data
var cities = [
    {
        city : 'Toronto',
        desc : 'This is the best city in the world!',
        lat : 43.7000,
        long : -79.4000
    },
    {
        city : 'New York',
        desc : 'This city is aiiiiite!',
        lat : 40.6700,
        long : -73.9400
    },
    {
        city : 'Chicago',
        desc : 'This is the second best city in the world!',
        lat : 41.8819,
        long : -87.6278
    },
    {
        city : 'Los Angeles',
        desc : 'This city is live!',
        lat : 34.0500,
        long : -118.2500
    },
    {
        city : 'Las Vegas',
        desc : 'Sin City...\'nuff said!',
        lat : 36.0800,
        long : -115.1522
    }
];

appwali.controller('PageLokasi', ['$scope', '$http', function($scope, $http) {

    /*token_wali  = window.localStorage.getItem("token_wali");
    nis_siswa  = $scope.data.msg;

    $http.get( _URL+"siswa-pelanggaran-wali?nis=" + nis_siswa + "&token=" + token_wali)
        .success(function (response) {

        $scope.list_pelanggaran = response.data;

    });*/


    var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(40.0000, -98.0000),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];
    
    var infoWindow = new google.maps.InfoWindow();
    
    var createMarker = function (info){
        
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.city
        });
        marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
        
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });
        
        $scope.markers.push(marker);
        
    }  
    
    for (i = 0; i < cities.length; i++){
        createMarker(cities[i]);
    }

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }

}]);

//--------------------------------------------------------------------LINK------------------------------------------

window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function(page, anim) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};

app.initialize();