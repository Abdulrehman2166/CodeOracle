/**
 * 🏛️ SDA CONCEPT: FACTORY PATTERN
 * Defines an interface for creating an object, but lets subclasses decide which class to instantiate.
 */

class Diagram {
    render() { throw new Error("Method must be implemented"); }
}

class ClassDiagram extends Diagram {
    render() { return "Rendering UML Class Diagram..."; }
}

class SequenceDiagram extends Diagram {
    render() { return "Rendering Interaction Sequence..."; }
}

class DiagramFactory {
    static createDiagram(type) {
        switch(type) {
            case 'class': return new ClassDiagram();
            case 'sequence': return new SequenceDiagram();
            default: throw new Error("Unknown Diagram Type");
        }
    }
}

export default DiagramFactory;
