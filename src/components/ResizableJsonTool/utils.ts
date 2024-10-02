import Ajv from 'ajv'

const ajv = new Ajv()

export const validateJson = (json: any, schema: string) => {
  if (schema) {
    try {
      const parsedSchema = JSON.parse(schema)
      const validate = ajv.compile(parsedSchema)
      return validate(json)
    } catch (error) {
      console.error('Failed to parse JSON schema:', error)
      return false
    }
  }
  return true
}

export const generateTypes = (json: any) => {
  // Implement type generation logic here
}

// Add other utility functions as needed