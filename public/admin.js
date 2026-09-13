const roles = ['Presidência', 'Vice-Presidência', 'Administrativo-Financeiro', 'Comercial', 'Gestão de Pessoas', 'Marketing', 'Projetos'];
const form = document.querySelector('#editor');
const editingPassword = document.querySelector('#editing-password');
const fields = document.querySelector('#fields');
const status = document.querySelector('#status');
const reload = document.querySelector('#reload');
let revision;
const preview = document.querySelector('#photo-preview');
const photoStatus = document.querySelector('#photo-status');
const discardPhoto = document.querySelector('#discard-photo');
let savedPhoto = '/diretoria-original.jpeg';
let previewUrl;
function showPhoto(url, selected = false) {
  if (previewUrl) { URL.revokeObjectURL(previewUrl); previewUrl = null; }
  preview.src = url;
  discardPhoto.hidden = !selected;
  photoStatus.textContent = selected ? 'Prévia da foto escolhida — ainda não salva.' : 'Foto atual do site.';
}
function setSavedPhoto(data) {
  savedPhoto = data.photo ? `/api/photo?path=${encodeURIComponent(data.photo)}` : '/diretoria-original.jpeg';
  showPhoto(savedPhoto);
}
preview.addEventListener('error', () => { photoStatus.textContent = 'Não foi possível exibir a foto. Escolha uma imagem válida ou recarregue os dados.'; });
document.querySelector('#preview-size').addEventListener('change', event => {
  document.querySelector('#photo-frame').classList.toggle('mobile', event.target.value === 'mobile');
});
form.elements.photo.addEventListener('change', () => {
  const file = form.elements.photo.files[0];
  if (!file) { showPhoto(savedPhoto); return; }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) {
    form.elements.photo.value = '';
    showPhoto(savedPhoto);
    photoStatus.textContent = 'Escolha JPEG, PNG ou WebP de até 2 MB.';
    return;
  }
  const url = URL.createObjectURL(file);
  showPhoto(url, true);
  previewUrl = url;
});
discardPhoto.addEventListener('click', () => { form.elements.photo.value = ''; showPhoto(savedPhoto); });
window.addEventListener('pagehide', () => { if (previewUrl) URL.revokeObjectURL(previewUrl); });
for (const [index, role] of roles.entries()) {
  const paragraph = document.createElement('p');
  const label = document.createElement('label');
  label.textContent = `${role} `;
  const input = document.createElement('input');
  input.name = `director-${index}`;
  input.required = true;
  input.maxLength = 100;
  label.append(input);
  paragraph.append(label);
  document.querySelector('#names').append(paragraph);
}

async function readResponse(response) {
  const data = await response.json().catch(() => { throw new Error('API indisponível. Use o ambiente Vercel configurado.'); });
  if (!response.ok) throw new Error(data.error || 'Não foi possível salvar.');
  return data;
}

async function load() {
  fields.disabled = true;
  reload.disabled = true;
  status.textContent = 'Carregando...';
  try {
    const data = await readResponse(await fetch('/api/content', { cache: 'no-store' }));
    data.names.forEach((name, index) => { form.elements[`director-${index}`].value = name; });
    form.elements.phone.value = data.phone;
    form.elements.photo.value = '';
    setSavedPhoto(data);
    revision = data.revision;
    fields.disabled = false;
    status.textContent = 'Dados carregados.';
  } catch (error) { status.textContent = error.message; }
  finally { reload.disabled = false; }
}

function photoData(file) {
  if (!file) return Promise.resolve(null);
  if (file.size > 2 * 1024 * 1024) return Promise.reject(new Error('A foto deve ter até 2 MB.'));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Não foi possível ler a foto.'));
    reader.readAsDataURL(file);
  });
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  fields.disabled = true;
  reload.disabled = true;
  status.textContent = 'Salvando...';
  try {
    const body = {
      names: roles.map((_, index) => form.elements[`director-${index}`].value),
      phone: form.elements.phone.value,
      revision,
      photoData: await photoData(form.elements.photo.files[0]),
    };
    const data = await readResponse(await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${editingPassword.value}` },
      body: JSON.stringify(body),
    }));
    revision = data.revision;
    form.elements.photo.value = '';
    setSavedPhoto(data);
    editingPassword.value = '';
    status.textContent = 'Alterações salvas. Recarregue o site para conferir.';
  } catch (error) { status.textContent = error.message; }
  finally { fields.disabled = false; reload.disabled = false; }
});
reload.addEventListener('click', load);
load();
