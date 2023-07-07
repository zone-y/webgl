export const shaders = {};
export function loadFile(file: string, dir: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'text';
        xhr.open('GET', `./assets/${dir}/${file}`);
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                shaders[file] = xhr.response;
                resolve(xhr.response);
            }
        }
        xhr.onerror = reject;
        xhr.send();
    })
}