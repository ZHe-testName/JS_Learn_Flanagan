//напишем клас для расширения Map
//в нем метод get будет возвращать не null
//а значение установленное по умолчанию
class DefaultMap extends Map {
    constructor(defaultValue) {
        super();

        this.defaultValue = defaultValue;
    }

    get(key) {
        if (this.has(key)) {
            //если ключ присутсвует то все работает стандартно
            //возвращаем значение с супер класса
            return super.get(key);
        };

        //иначе отдаем дефолтное значение
        return this.defaultValue;
    }
};

//Класс для расчета гистограммы частоты использования букв
class Histogram {
    constructor() {
        //отображение счетчика букв
        this.letterCounts = new DefaultMap(0);

        //Общее количество букв
        this.lettersCount = 0;
    }

    //метод для обновления гастограммы с буквами из нового текста
    add(text) {
        //удаляем все пробелы с текста
        //переводим буквы в верхний ригистр
        text = text.replace(/\s/g, '').toUpperCase();

        //проходам циклом по тексту
        for(let char of text) {
            //получаем старый счетчик
            let count = this.letterCounts.get(char);

            //инкрементируем счетчик
            //устонавливаем новое значение
            this.letterCounts.set(char, count+= 1);

            //инкрементируем общий счетчик букв
            this.lettersCount++;
        };
    }

    //метод для преобразования гистограммы в строку 
    //для отображения графики ASCII
    toString() {
        //преобразовать Мар в массив с кортежами
        //пар ключ/значение
        let entries = [...this.letterCounts];

        //сортируем массив по счетчикам а потом в алфавитном порядке
        entries.sort((a, b) => {
            //в случае если счетчики одинаковы
            //сортируем по алфавиту
            if(a[1] === b[1]) {
                return (a[0] < b[0]) ? -1 : 1;
            };

            return b[1] - a[1];
        });

        //преобразовать счетчики в проценты
        for(let entry of entries) {
            entry[1] = entry[1] / this.lettersCount * 100;
        };

        //отбрасываем все записи меньше 1%
        entries = entries.filter(entry => entry[1] >= 1);

        //преобразовать каждую запись в строку текста 
        //определенного формата
        const lines = entries.map(
            ([l, n]) => `${l} : ${'#'.repeat(Math.round(n))} ${n.toFixed(2)}%`
        );

        //возвращаем сцепку строк соедененных
        //смиволом перевода строки
        return lines.join('\n');
    }
};

//далее создаем асинхронную функцию
//которая будет читать стандартный поток ввода
//асинхронно добавлять текст в колекцию
//и по окончанию ввода выведет гистограмму
async function gistogramFromStdin(text) {
    //чтобы строки читались в юникоде
    //а не в байтах
    process.stdin.setEncoding('utf-8');

    let histogram = new Histogram();

    for await (let chunk of process.stdin) {
        histogram.add(chunk);
    };
    // histogram.add(text);

    return histogram;
};

gistogramFromStdin().then(histogram => {console.log(histogram.toString());});