from neo4j import GraphDatabase

NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "password123"

class ImpactAnalyzer:
    def __init__(self):
        self.driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

    def close(self):
        self.driver.close()

    def find_breakage_map(self, variable_or_file):
        """Traverses the graph to find all dependencies that could break."""
        query = """
        MATCH (start {name: $name})
        MATCH (start)<-[:IMPORTS|CALLS|DEPENDS_ON*1..5]-(dependent)
        RETURN dependent.name as name, labels(dependent) as type, dependent.path as path
        """
        
        with self.driver.session() as session:
            result = session.run(query, {"name": variable_or_file})
            breakages = []
            for record in result:
                breakages.append({
                    "name": record["name"],
                    "type": record["type"][0] if record["type"] else "Unknown",
                    "path": record["path"]
                })
            return breakages

    def generate_report(self, variable_or_file):
        breakages = self.find_breakage_map(variable_or_file)
        if not breakages:
            return f"✅ No direct or indirect breakages found for '{variable_or_file}'."
        
        report = f"# 🏮 Impact Analysis: Breakage Map for '{variable_or_file}'\n\n"
        report += f"Found **{len(breakages)}** potential casualties across your projects.\n\n"
        report += "| Entity | Type | Project / Path |\n"
        report += "| :--- | :--- | :--- |\n"
        for b in breakages:
            report += f"| `{b['name']}` | {b['type']} | {b['path'] if b['path'] else 'Global'} |\n"
        
        return report

if __name__ == "__main__":
    import sys
    target = sys.argv[1] if len(sys.argv) > 1 else "UserSecret"
    analyzer = ImpactAnalyzer()
    try:
        print(analyzer.generate_report(target))
    finally:
        analyzer.close()
