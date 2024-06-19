try {
  pdf2htmlEX.defaultViewer = new pdf2htmlEX.Viewer({});
} catch(e) {}

// ready function
document.addEventListener("DOMContentLoaded", function() {
  // check if cuti on local storage or else redirect to ./
  if (localStorage.getItem('cuti') === null) {
    window.location.href = './';
  }
  // get data from local storage
  let cuti = JSON.parse(localStorage.getItem('cuti'));
  // set pengajuan format = 'd mmmm' from tanggal
  let pengajuan = new Date(cuti.tanggal);
  let pengajuanFormat = pengajuan.getDate() + ' ' + pengajuan.toLocaleString('id-ID', { month: 'long' });
  // set tahun format = 'yy' from tanggal
  let tahun = pengajuan.getFullYear().toString().substr(-2);
  // set dari format = 'd mmmm yyyy' from cuti.dari
  let dari = new Date(cuti.dari);
  let dariFormat = dari.getDate() + ' ' + dari.toLocaleString('id-ID', { month: 'long' }) + ' ' + dari.getFullYear();
  // set sampai format = 'd mmmm yyyy' from cuti.sampai
  let sampai = new Date(cuti.sampai);
  let sampaiFormat = sampai.getDate() + ' ' + sampai.toLocaleString('id-ID', { month: 'long' }) + ' ' + sampai.getFullYear();
  // if dari = sampai then sampai = ' '
  if (dari.getTime() === sampai.getTime()) {
    sampaiFormat = ' ';
  }

  // set data to form
  document.getElementById('nama').innerText = cuti.nama;
  document.getElementById('nik').innerText = cuti.nik;
  document.getElementById('jabatan').innerText = cuti.jabatan;
  document.getElementById('keperluan').innerText = cuti.keperluan;
  document.getElementById('dari').innerText = dariFormat;
  document.getElementById('sampai').innerText = sampaiFormat;
  document.getElementById('hari').innerText = cuti.hari;
  document.getElementById('nohp').innerText = cuti.nohp;
  document.getElementById('mengajukan').innerText = cuti.nama;
  document.getElementById('menyetujui').innerText = cuti.namaMenyetujui;
  document.getElementById('mengetahui').innerText = cuti.namaMengetahui;
  document.getElementById('pengajuan').innerText = pengajuanFormat;
  document.getElementById('tahun').innerText = tahun;
  // remove class tidak-perlu from jabatanMenyetujui+cuti.jabatanMenyetujui
  document.getElementById('jabatanMenyetujui' + cuti.jabatanMenyetujui).classList.remove('tidak-perlu');
  // remove class tidak-perlu from jabatanMengetahui+cuti.jabatanMengetahui
  document.getElementById('jabatanMengetahui' + cuti.jabatanMengetahui).classList.remove('tidak-perlu'); 

  // print the form
  window.print();
});