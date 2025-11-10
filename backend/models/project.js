import mongoose from "mongoose";

// ============================================
// SCHÉMA 1: CATALOGUE DES TECHNOLOGIES PAR MÉTIER
// ============================================
const techStackCatalogSchema = new mongoose.Schema({
  job: {
    type: String,
    enum: ['devops', 'frontend', 'backend', 'cybersecurity', 'data-science'], // ← CHANGÉ
    required: true,
    unique: true
  },
  categories: {
    languages: { type: [String], default: [] },
    frameworks: { type: [String], default: [] },
    libraries: { type: [String], default: [] },
    tools: { type: [String], default: [] },
    databases: { type: [String], default: [] },
    cloud: { type: [String], default: [] },
    styling: { type: [String], default: [] },
    orms: { type: [String], default: [] },
    security: { type: [String], default: [] },
    cryptography: { type: [String], default: [] },
    bigData: { type: [String], default: [] },
    mlOps: { type: [String], default: [] }
  }
}, { timestamps: true });

// ============================================
// SCHÉMA 2: TECHNOLOGIES UTILISATEUR
// ============================================
const userTechStackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  job: {
    type: String,
    enum: ['devops', 'frontend', 'backend', 'cybersecurity', 'data-science'], // ← CHANGÉ
    required: true
  },
  selectedTechnologies: {
    languages: {
      type: [String],
      default: [],
      validate: {
        validator: function(arr) { return arr.length <= 10; },
        message: 'Maximum 10 langages autorisés'
      }
    },
    frameworks: {
      type: [String],
      default: [],
      validate: {
        validator: function(arr) { return arr.length <= 15; },
        message: 'Maximum 15 frameworks autorisés'
      }
    },
    libraries: {
      type: [String],
      default: [],
      validate: {
        validator: function(arr) { return arr.length <= 20; },
        message: 'Maximum 20 bibliothèques autorisées'
      }
    },
    tools: {
      type: [String],
      default: [],
      validate: {
        validator: function(arr) { return arr.length <= 15; },
        message: 'Maximum 15 outils autorisés'
      }
    },
    databases: {
      type: [String],
      default: [],
      validate: {
        validator: function(arr) { return arr.length <= 8; },
        message: 'Maximum 8 bases de données autorisées'
      }
    },
    cloud: { type: [String], default: [] },
    styling: { type: [String], default: [] },
    orms: { type: [String], default: [] },
    security: { type: [String], default: [] },
    cryptography: { type: [String], default: [] },
    bigData: { type: [String], default: [] },
    mlOps: { type: [String], default: [] }
  },
  expertise: {
    type: Map,
    of: {
      type: String,
      enum: ['débutant', 'intermédiaire', 'avancé', 'expert']
    },
    default: new Map()
  },
  experience: {
    type: Map,
    of: Number,
    default: new Map()
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const TechStackCatalog = mongoose.model('TechStackCatalog', techStackCatalogSchema);
const UserTechStack = mongoose.model('UserTechStack', userTechStackSchema);

// ============================================
// DONNÉES INITIALES (SEED DATA) - CORRIGÉ
// ============================================
const techStackSeedData = [
  {
    job: 'devops', // ← en minuscule
    categories: {
      languages: ['Python', 'Bash/Shell', 'Go', 'Ruby', 'PowerShell', 'JavaScript/Node.js', 'Perl', 'Groovy', 'YAML', 'HCL'],
      frameworks: ['Terraform', 'Ansible', 'Puppet', 'Chef', 'SaltStack', 'CloudFormation', 'Pulumi', 'CDK'],
      tools: ['Docker', 'Kubernetes', 'Jenkins', 'GitLab CI/CD', 'GitHub Actions', 'ArgoCD', 'Prometheus', 'Grafana', 'ELK Stack', 'Vault', 'Helm'],
      cloud: ['AWS', 'Azure', 'Google Cloud Platform', 'DigitalOcean', 'Oracle Cloud'],
      databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'InfluxDB']
    }
  },
  {
    job: 'frontend',
    categories: {
      languages: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Sass/SCSS', 'Less', 'WebAssembly'],
      frameworks: ['React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte', 'SvelteKit', 'Remix', 'Astro', 'Solid.js'],
      libraries: ['Redux', 'Zustand', 'React Query', 'Axios', 'Lodash', 'Moment.js', 'Chart.js', 'D3.js', 'Three.js', 'GSAP', 'Framer Motion'],
      styling: ['Tailwind CSS', 'Bootstrap', 'Material-UI', 'Chakra UI', 'Styled Components', 'Ant Design', 'Shadcn/ui'],
      tools: ['Webpack', 'Vite', 'ESLint', 'Prettier', 'Babel', 'npm', 'yarn', 'pnpm', 'Storybook', 'Jest', 'Cypress']
    }
  },
  {
    job: 'backend',
    categories: {
      languages: ['JavaScript/Node.js', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'PHP', 'Ruby', 'Rust', 'Kotlin', 'Scala'],
      frameworks: ['Express.js', 'NestJS', 'Fastify', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'ASP.NET Core', 'Laravel', 'Ruby on Rails'],
      databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra', 'Oracle', 'SQL Server', 'SQLite', 'DynamoDB'],
      orms: ['Prisma', 'TypeORM', 'Sequelize', 'Mongoose', 'SQLAlchemy', 'Hibernate', 'Entity Framework', 'Eloquent'],
      tools: ['Docker', 'RabbitMQ', 'Kafka', 'GraphQL', 'REST API', 'gRPC', 'Swagger', 'Postman', 'Nginx']
    }
  },
  {
    job: 'cybersecurity',
    categories: {
      languages: ['Python', 'C', 'C++', 'Assembly', 'JavaScript', 'Bash/Shell', 'PowerShell', 'Go', 'Rust'],
      frameworks: ['Metasploit', 'Burp Suite', 'OWASP ZAP', 'Scapy', 'Impacket', 'BeEF', 'SQLMap'],
      tools: ['Nmap', 'Wireshark', 'Nessus', 'OpenVAS', 'Snort', 'Splunk', 'Kali Linux', 'John the Ripper', 'Hashcat', 'Ghidra', 'IDA Pro', 'Nikto'],
      security: ['OWASP Top 10', 'CIS Benchmarks', 'NIST Framework', 'ISO 27001', 'PCI DSS', 'GDPR'],
      cryptography: ['OpenSSL', 'PyCrypto', 'Cryptography.io', 'Libsodium', 'GPG/PGP', 'Vault']
    }
  },
  {
    job: 'data-science', // ← CHANGÉ : maintenant avec tiret
    categories: {
      languages: ['Python', 'R', 'SQL', 'Julia', 'Scala', 'Java'],
      frameworks: ['TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'XGBoost', 'LightGBM', 'Hugging Face', 'FastAI'],
      libraries: ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Plotly', 'SciPy', 'NLTK', 'SpaCy', 'OpenCV'],
      bigData: ['Apache Spark', 'Hadoop', 'Kafka', 'Flink', 'Dask'],
      mlOps: ['MLflow', 'Kubeflow', 'Airflow', 'DVC', 'Weights & Biases'],
      databases: ['PostgreSQL', 'MongoDB', 'Redis', 'Snowflake', 'BigQuery', 'Redshift'],
      tools: ['Jupyter', 'Google Colab', 'VS Code', 'RStudio', 'Tableau', 'Power BI']
    }
  }
];

async function seedTechStackCatalog() {
  try {
    for (const data of techStackSeedData) {
      const existing = await TechStackCatalog.findOne({ job: data.job });
      if (!existing) {
        await TechStackCatalog.create(data);
        console.log(`✅ Catalogue inséré pour le métier ${data.job}`);
      } else {
        console.log(`⚠️ Catalogue pour ${data.job} existe déjà`);
      }
    }
    return { message: "Seeding des données terminé avec succès" };
  } catch (error) {
    console.error("❌ Erreur lors du seeding:", error);
    throw new Error("Erreur lors du seeding du catalogue de technologies");
  }
}

export { TechStackCatalog, UserTechStack, seedTechStackCatalog };