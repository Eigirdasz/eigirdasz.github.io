/* mvsteel-preview-v13 — price request dialog (preview only: nothing is sent), spec tables with filters */
(function(){
'use strict';
var d=document;
function el(t,a,h){var e=d.createElement(t);if(a)for(var k in a){if(k==='class')e.className=a[k];else e.setAttribute(k,a[k]);}if(h!=null)e.innerHTML=h;return e;}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

/* ---------- Gauti kainą ---------- */
var dlg=null,lastFocus=null;
function build(){
  dlg=el('dialog',{'class':'qd','aria-labelledby':'qd-h'});
  dlg.innerHTML=
  '<div class="qd-in"><div class="qd-top"><h2 id="qd-h">Gauti kainą</h2><button type="button" class="qd-x" aria-label="Uždaryti">✕</button></div>'+
  '<p class="qd-note"><strong>Peržiūros versija:</strong> forma neišsiunčia duomenų – užklausa niekur nepateks. Skubiai skambinkite <a href="tel:+37037328200">+370 37 328200</a>.</p>'+
  '<form class="qd-f" novalidate>'+
  '<div class="qf qf-w"><label for="qf-prod">Produktas *</label><input id="qf-prod" name="produktas" required autocomplete="off"></div>'+
  '<div class="qf"><label for="qf-grade">Lydinys / markė</label><input id="qf-grade" name="lydinys" list="qf-grades" placeholder="pvz. AISI 304"><datalist id="qf-grades"></datalist></div>'+
  '<div class="qf"><label for="qf-dim">Matmenys</label><input id="qf-dim" name="matmenys" placeholder="pvz. 2 × 1000 × 2000 mm"></div>'+
  '<div class="qf qf-qty"><label for="qf-qty">Kiekis *</label><div class="qf-row"><input id="qf-qty" name="kiekis" type="number" min="0" step="any" inputmode="decimal" required><select id="qf-unit" name="vienetai" aria-label="Vienetai"><option>vnt.</option><option>m</option><option>kg</option><option>t</option><option>lakštai</option><option>komplektai</option></select></div></div>'+
  '<div class="qf"><label for="qf-city">Miestas</label><input id="qf-city" name="miestas" autocomplete="address-level2"></div>'+
  '<div class="qf"><label for="qf-name">Vardas *</label><input id="qf-name" name="vardas" required autocomplete="name"></div>'+
  '<div class="qf"><label for="qf-co">Įmonė</label><input id="qf-co" name="imone" autocomplete="organization"></div>'+
  '<div class="qf"><label for="qf-tel">Telefonas</label><input id="qf-tel" name="telefonas" type="tel" autocomplete="tel" inputmode="tel" placeholder="+370 …"></div>'+
  '<div class="qf"><label for="qf-mail">El. paštas</label><input id="qf-mail" name="el_pastas" type="email" autocomplete="email"></div>'+
  '<p class="qf-hint qf-w" id="qf-contact-hint">Nurodykite telefoną arba el. paštą *</p>'+
  '<div class="qf qf-w"><label for="qf-file">Brėžinys (nebūtina)</label><input id="qf-file" name="brezinys" type="file" accept=".pdf,.dwg,.dxf,.step,.stp,.jpg,.jpeg,.png"><small>PDF, DWG, DXF, STEP, JPG, PNG – iki 10 MB</small></div>'+
  '<div class="qf qf-w qf-check"><input id="qf-gdpr" name="sutikimas" type="checkbox" required><label for="qf-gdpr">Sutinku, kad UAB „MV STEEL GROUP“ tvarkytų mano pateiktus duomenis, kad atsakytų į šią užklausą. *</label></div>'+
  '<div class="qf-err qf-w" role="alert" aria-live="assertive"></div>'+
  '<div class="qf-actions qf-w"><button type="submit" class="btn btn-lg">Gauti kainą</button></div></form>'+
  '<div class="qd-ok" hidden tabindex="-1"><div class="qd-ok-ic" aria-hidden="true">✓</div><h3>Užklausa paruošta</h3><p>Tai peržiūros versija – duomenys <strong>niekur neišsiųsti ir neišsaugoti</strong>. Tikroje svetainėje vadybininkas atsakytų per 1 darbo dieną.</p><button type="button" class="btn qd-close2">Uždaryti</button></div></div>';
  d.body.appendChild(dlg);
  var f=dlg.querySelector('form');
  dlg.querySelector('.qd-x').addEventListener('click',close);
  dlg.querySelector('.qd-close2').addEventListener('click',close);
  dlg.addEventListener('click',function(e){if(e.target===dlg)close();});
  dlg.addEventListener('close',function(){d.documentElement.classList.remove('qd-open');if(lastFocus&&lastFocus.focus)lastFocus.focus();});
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var errs=[],first=null;
    function bad(id,msg){var i=d.getElementById(id);i.setAttribute('aria-invalid','true');errs.push(msg);if(!first)first=i;}
    [].forEach.call(f.querySelectorAll('[aria-invalid]'),function(i){i.removeAttribute('aria-invalid');});
    if(!f.produktas.value.trim())bad('qf-prod','Nurodykite produktą.');
    var q=parseFloat(f.kiekis.value);if(!(q>0))bad('qf-qty','Nurodykite kiekį (daugiau nei 0).');
    if(!f.vardas.value.trim())bad('qf-name','Nurodykite vardą.');
    var tel=f.telefonas.value.trim(),mail=f.el_pastas.value.trim();
    if(!tel&&!mail){bad('qf-tel','Nurodykite telefoną arba el. paštą.');d.getElementById('qf-mail').setAttribute('aria-invalid','true');}
    if(tel&&!/^[+\d][\d\s()-]{6,}$/.test(tel))bad('qf-tel','Patikrinkite telefono numerį.');
    if(mail&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail))bad('qf-mail','Patikrinkite el. pašto adresą.');
    var fi=f.brezinys.files&&f.brezinys.files[0];if(fi&&fi.size>10*1024*1024)bad('qf-file','Brėžinys didesnis nei 10 MB.');
    if(!f.sutikimas.checked)bad('qf-gdpr','Pažymėkite sutikimą dėl duomenų tvarkymo.');
    var box=f.querySelector('.qf-err');
    if(errs.length){box.innerHTML='<ul>'+errs.map(function(m){return '<li>'+esc(m)+'</li>';}).join('')+'</ul>';box.hidden=false;first.focus();return;}
    box.hidden=true;box.innerHTML='';
    /* Preview: deliberately no fetch / XHR / mailto — nothing leaves the browser. */
    f.hidden=true;dlg.querySelector('.qd-note').hidden=true;var ok=dlg.querySelector('.qd-ok');ok.hidden=false;ok.focus();
  });
}
function open(src){
  if(!dlg)build();
  var f=dlg.querySelector('form');f.reset();f.hidden=false;dlg.querySelector('.qd-note').hidden=false;dlg.querySelector('.qd-ok').hidden=true;
  var e=f.querySelector('.qf-err');e.hidden=true;e.innerHTML='';
  [].forEach.call(f.querySelectorAll('[aria-invalid]'),function(i){i.removeAttribute('aria-invalid');});
  var ctx=(src&&src.getAttribute('data-quote-product'))?src:d.querySelector('[data-quote-page]');
  var prod=ctx?ctx.getAttribute('data-quote-product')||'':'';
  var grades=ctx?(ctx.getAttribute('data-quote-grades')||'').split('|').filter(Boolean):[];
  f.produktas.value=prod;
  dlg.querySelector('#qf-grades').innerHTML=grades.concat(['Nežinau – patarkite']).map(function(g){return '<option value="'+esc(g)+'">';}).join('');
  if(grades.length===1)f.lydinys.value=grades[0];
  lastFocus=src||d.activeElement;
  d.documentElement.classList.add('qd-open');
  if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','');
  (prod?f.kiekis:f.produktas).focus();
}
function close(){if(dlg.close)dlg.close();else{dlg.removeAttribute('open');d.documentElement.classList.remove('qd-open');}}
d.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-quote]');if(!t)return;e.preventDefault();open(t);});
window.mvQuote=open;
if(location.hash==='#kaina'){var b=d.querySelector('[data-quote-page]');if(b)setTimeout(function(){open(b);},50);}

/* ---------- spec tables ---------- */
[].forEach.call(d.querySelectorAll('.spec[data-src]'),function(root){
  var cols=JSON.parse(root.getAttribute('data-cols')),filt=JSON.parse(root.getAttribute('data-filters')),data=null;
  var state={sort:null,dir:1,f:{},q:'',limit:50};
  var ui=root.querySelector('.spec-ui');ui.hidden=false;root.querySelector('.spec-nojs')&&(root.querySelector('.spec-nojs').hidden=true);
  var fbox=root.querySelector('.spec-filters'),cnt=root.querySelector('.spec-count'),tb=root.querySelector('tbody'),more=root.querySelector('.spec-more'),thead=root.querySelector('thead tr'),q=root.querySelector('.spec-q'),reset=root.querySelector('.spec-reset');
  thead.innerHTML=cols.map(function(c,i){return '<th scope="col" aria-sort="none"><button type="button" data-i="'+i+'">'+esc(c)+'<span aria-hidden="true" class="spec-arr"></span></button></th>';}).join('')+'<th scope="col"><span class="sr">Veiksmai</span></th>';
  function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
  function num(v){var m=String(v).replace(',','.').match(/-?\d+(\.\d+)?/);return m?parseFloat(m[0]):NaN;}
  fetch(root.getAttribute('data-src')).then(function(r){return r.json();}).then(function(j){data=j;
    filt.forEach(function(fl){
      var vals={};data.forEach(function(r){String(r.c[fl.i]||'').split(' | ').forEach(function(v){v=v.trim();if(v)vals[v]=(vals[v]||0)+1;});});
      var keys=Object.keys(vals).sort(function(a,b){var na=num(a),nb=num(b);return (!isNaN(na)&&!isNaN(nb)&&na!==nb)?na-nb:a.localeCompare(b,'lt');});
      if(keys.length<2)return;
      state.f[fl.i]=[];
      var g=el('div',{'class':'spec-fg',role:'group','aria-label':cols[fl.i],'data-i':fl.i});
      if(keys.length<=8){
        g.innerHTML='<span class="spec-fl">'+esc(cols[fl.i])+'</span>'+keys.map(function(k){return '<button type="button" class="chip" aria-pressed="false" data-v="'+esc(k)+'">'+esc(k)+' <small>'+vals[k]+'</small></button>';}).join('');
        g.addEventListener('click',function(e){var b=e.target.closest('.chip');if(!b)return;var on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);var a=state.f[fl.i],v=b.getAttribute('data-v');if(on)a.push(v);else a.splice(a.indexOf(v),1);state.limit=50;render();});
      }else{
        var id='sf-'+Math.random().toString(36).slice(2,8);
        g.innerHTML='<label class="spec-fl" for="'+id+'">'+esc(cols[fl.i])+'</label><select id="'+id+'"><option value="">Visi ('+keys.length+')</option>'+keys.map(function(k){return '<option value="'+esc(k)+'">'+esc(k)+'</option>';}).join('')+'</select>';
        g.querySelector('select').addEventListener('change',function(){state.f[fl.i]=this.value?[this.value]:[];state.limit=50;render();});
      }
      fbox.appendChild(g);
    });
    render();
  }).catch(function(){cnt.textContent='Lentelės nepavyko įkelti.';});
  thead.addEventListener('click',function(e){var b=e.target.closest('button[data-i]');if(!b)return;var i=+b.getAttribute('data-i');if(state.sort===i)state.dir=-state.dir;else{state.sort=i;state.dir=1;}render();});
  q.addEventListener('input',function(){state.q=norm(q.value.trim());state.limit=50;render();});
  more.addEventListener('click',function(){state.limit+=100;render();});
  reset.addEventListener('click',function(){for(var k in state.f)state.f[k]=[];[].forEach.call(fbox.querySelectorAll('.chip'),function(b){b.setAttribute('aria-pressed','false');});[].forEach.call(fbox.querySelectorAll('select'),function(s){s.value='';});q.value='';state.q='';state.limit=50;render();});
  function cellv(r,k){return String(r.c[k]||'').split(' | ').map(function(s){return s.trim();});}
  function pass(r,skip){
    for(var k in state.f){if(k==skip)continue;var a=state.f[k];if(!a.length)continue;var cell=cellv(r,k);if(!a.some(function(v){return cell.indexOf(v)>=0;}))return false;}
    if(state.q&&norm(r.c.join(' ')).indexOf(state.q)<0)return false;return true;}
  function facets(){
    [].forEach.call(fbox.querySelectorAll('.spec-fg'),function(g){var k=g.getAttribute('data-i'),cn={};
      data.forEach(function(r){if(pass(r,k))cellv(r,k).forEach(function(v){if(v)cn[v]=(cn[v]||0)+1;});});
      [].forEach.call(g.querySelectorAll('.chip'),function(b){var n=cn[b.getAttribute('data-v')]||0;b.querySelector('small').textContent=n;b.disabled=!n&&b.getAttribute('aria-pressed')!=='true';});
      [].forEach.call(g.querySelectorAll('option'),function(o){if(!o.value)return;var n=cn[o.value]||0;o.textContent=o.value+' ('+n+')';o.disabled=!n&&!o.selected;});});
  }
  function render(){
    var rows=data.filter(function(r){return pass(r,null);});facets();
    if(state.sort!==null){var i=state.sort,dir=state.dir;rows=rows.slice().sort(function(a,b){var x=a.c[i]||'',y=b.c[i]||'',nx=num(x),ny=num(y);if(!x&&y)return 1;if(x&&!y)return -1;if(!isNaN(nx)&&!isNaN(ny)&&nx!==ny)return (nx-ny)*dir;return String(x).localeCompare(String(y),'lt')*dir;});}
    [].forEach.call(thead.querySelectorAll('th[aria-sort]'),function(th,j){th.setAttribute('aria-sort',state.sort===j?(state.dir>0?'ascending':'descending'):'none');});
    var any=Object.keys(state.f).some(function(k){return state.f[k].length;})||state.q;reset.hidden=!any;
    cnt.textContent='Rasta: '+rows.length+' iš '+data.length;
    tb.innerHTML=rows.slice(0,state.limit).map(function(r){
      return '<tr>'+r.c.map(function(v,j){return j===0?'<td data-l="'+esc(cols[0])+'"><a href="'+r.u+'">'+esc(v)+'</a></td>':'<td data-l="'+esc(cols[j])+'">'+(v?esc(v):'<span class="spec-na">–</span>')+'</td>';}).join('')+
      '<td class="spec-act"><a class="spec-q-btn" href="'+r.u+'#kaina" data-quote data-quote-product="'+esc(r.c[0]+(r.k?' ('+r.k+')':''))+'" data-quote-grades="'+esc(r.g||'')+'">Gauti kainą</a></td></tr>';}).join('')||'<tr><td colspan="'+(cols.length+1)+'" class="spec-empty">Pagal pasirinktus filtrus gaminių nerasta.</td></tr>';
    more.hidden=rows.length<=state.limit;more.textContent='Rodyti daugiau ('+(rows.length-state.limit)+')';
  }
});
})();
