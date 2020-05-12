import { InMemoryDbService } from 'angular-in-memory-web-api';

export class TestData implements InMemoryDbService {
    createDb() {
        let boolDetails = [
            { id: 100, name: 'Angular', category: "Angular" },
            { id: 101, name: 'Java', category: "Java" },
            { id: 102, name: '.Net', category: "node" }
        ];
        return { books: boolDetails };
    }
}