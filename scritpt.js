const defaultData = {
    image: document.querySelector('.profile-picture').src,
    name: document.querySelector('h1').textContent.trim(),
    username: document.querySelector('.username').textContent.trim(),
    description: document.querySelector('.description').textContent.trim(),
    background: '#15151f',
    accent: '#357cff',
    links: [...document.querySelectorAll('.link')].map((link) => ({
        label: [...link.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent.trim())
            .join(' ')
            .trim(),
        url: link.href
    }))
};

const elements = {
    card: document.querySelector('.card'),
    loginPanel: document.querySelector('#loginPanel'),
    customizer: document.querySelector('#customizer'),
    customizeButton: document.querySelector('#customizeButton'),
    closeLogin: document.querySelector('#closeLogin'),
    loginForm: document.querySelector('#loginForm'),
    loginUser: document.querySelector('#loginUser'),
    loginPassword: document.querySelector('#loginPassword'),
    loginError: document.querySelector('#loginError'),
    closeCustomizer: document.querySelector('#closeCustomizer'),
    saveButton: document.querySelector('#saveButton'),
    logoutButton: document.querySelector('#logoutButton'),
    profile: document.querySelector('.profile-picture'),
    name: document.querySelector('h1'),
    username: document.querySelector('.username'),
    description: document.querySelector('.description'),
    links: document.querySelector('.links'),
    profileInput: document.querySelector('#profileInput'),
    nameInput: document.querySelector('#nameInput'),
    usernameInput: document.querySelector('#usernameInput'),
    descriptionInput: document.querySelector('#descriptionInput'),
    backgroundInput: document.querySelector('#backgroundColorInput'),
    accentInput: document.querySelector('#accentColorInput'),
    linkFields: document.querySelector('#linkFields'),
    addLinkButton: document.querySelector('#addLinkButton'),
    resetButton: document.querySelector('#resetButton')
};

let data = loadData();

function loadData() {
    try {
        const savedData = JSON.parse(localStorage.getItem('profileCard'));
        return {
            ...defaultData,
            ...savedData,
            links: (savedData?.links || defaultData.links).map((link) => ({
                ...link,
                label: link.label.replace(/^(🦋|𝕏|📸)\s*/, '')
            }))
        };
    } catch {
        return { ...defaultData };
    }
}

function saveData() {
    localStorage.setItem('profileCard', JSON.stringify(data));
}

function isLoggedIn() {
    return sessionStorage.getItem('profileCardSession') === 'active';
}

function render() {
    elements.profile.src = data.image;
    elements.name.textContent = data.name;
    elements.username.textContent = data.username;
    elements.description.textContent = data.description;
    document.documentElement.style.setProperty('--page-background', data.background);
    document.documentElement.style.setProperty('--accent', data.accent);

    elements.links.innerHTML = data.links.map((link, index) => `
        <a class="link" href="${escapeAttribute(link.url)}" target="_blank" rel="noopener">
            <span class="icon">${index === 0 ? '🦋' : index === 1 ? '𝕏' : '🔗'}</span>
            ${escapeHtml(link.label)}
        </a>
    `).join('');

    elements.nameInput.value = data.name;
    elements.usernameInput.value = data.username;
    elements.descriptionInput.value = data.description;
    elements.backgroundInput.value = data.background;
    elements.accentInput.value = data.accent;
    renderLinkFields();
}

function renderPreview() {
    elements.profile.src = data.image;
    elements.name.textContent = data.name;
    elements.username.textContent = data.username;
    elements.description.textContent = data.description;
    document.documentElement.style.setProperty('--page-background', data.background);
    document.documentElement.style.setProperty('--accent', data.accent);
    elements.links.innerHTML = data.links.map((link, index) => `
        <a class="link" href="${escapeAttribute(link.url)}" target="_blank" rel="noopener">
            <span class="icon">${index === 0 ? '🦋' : index === 1 ? '𝕏' : '🔗'}</span>
            ${escapeHtml(link.label)}
        </a>
    `).join('');
}

function renderLinkFields() {
    elements.linkFields.innerHTML = data.links.map((link, index) => `
        <div class="link-field" data-index="${index}">
            <input class="link-label" type="text" value="${escapeAttribute(link.label)}" placeholder="Nombre">
            <input class="link-url" type="url" value="${escapeAttribute(link.url)}" placeholder="https://..."><button class="remove-link" type="button" aria-label="Eliminar enlace">&times;</button>
        </div>
    `).join('');
}

function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function escapeAttribute(value) {
    return escapeHtml(value);
}

function readEditorData() {
    data.name = elements.nameInput.value;
    data.username = elements.usernameInput.value;
    data.description = elements.descriptionInput.value;
    data.background = elements.backgroundInput.value;
    data.accent = elements.accentInput.value;
    data.links = [...elements.linkFields.querySelectorAll('.link-field')].map((field) => ({
        label: field.querySelector('.link-label').value,
        url: field.querySelector('.link-url').value
    }));
}

function updatePreview() {
    readEditorData();
    renderPreview();
}

function saveLinkFields() {
    data.links = [...elements.linkFields.querySelectorAll('.link-field')].map((field) => ({
        label: field.querySelector('.link-label').value,
        url: field.querySelector('.link-url').value
    }));
    renderPreview();
}

function toggleCustomizer(isOpen) {
    elements.customizer.classList.toggle('is-open', isOpen);
    elements.customizer.setAttribute('aria-hidden', String(!isOpen));
    elements.customizeButton.setAttribute('aria-expanded', String(isOpen));
}

function toggleLogin(isOpen) {
    elements.loginPanel.classList.toggle('is-open', isOpen);
    elements.loginPanel.setAttribute('aria-hidden', String(!isOpen));
}

function saveChanges() {
    saveData();
    elements.saveButton.textContent = 'Cambios guardados';
    window.setTimeout(() => {
        elements.saveButton.textContent = 'Guardar cambios';
    }, 1600);
}

elements.customizeButton.addEventListener('click', () => {
    if (isLoggedIn()) {
        toggleCustomizer(true);
        return;
    }
    toggleLogin(true);
});
elements.closeLogin.addEventListener('click', () => toggleLogin(false));
elements.closeCustomizer.addEventListener('click', () => toggleCustomizer(false));
elements.saveButton.addEventListener('click', saveChanges);
elements.logoutButton.addEventListener('click', () => {
    sessionStorage.removeItem('profileCardSession');
    toggleCustomizer(false);
});

elements.loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const isValid = elements.loginUser.value.trim() === 'sammu' && elements.loginPassword.value === '1234';
    if (!isValid) {
        elements.loginError.textContent = 'Usuario o contraseña incorrectos.';
        return;
    }
    sessionStorage.setItem('profileCardSession', 'active');
    elements.loginForm.reset();
    elements.loginError.textContent = '';
    toggleLogin(false);
    toggleCustomizer(true);
});
[
    elements.nameInput,
    elements.usernameInput,
    elements.descriptionInput,
    elements.backgroundInput,
    elements.accentInput
].forEach((input) => input.addEventListener('input', updatePreview));

elements.profileInput.addEventListener('change', () => {
    const [file] = elements.profileInput.files;
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        data.image = reader.result;
        render();
    });
    reader.readAsDataURL(file);
});

elements.addLinkButton.addEventListener('click', () => {
    data.links.push({ label: 'Nuevo enlace', url: 'https://' });
    render();
});

elements.linkFields.addEventListener('input', saveLinkFields);
elements.linkFields.addEventListener('click', (event) => {
    if (!event.target.classList.contains('remove-link')) return;
    const index = Number(event.target.closest('.link-field').dataset.index);
    data.links.splice(index, 1);
    render();
});

elements.resetButton.addEventListener('click', () => {
    data = { ...defaultData, links: defaultData.links.map((link) => ({ ...link })) };
    render();
});

render();
