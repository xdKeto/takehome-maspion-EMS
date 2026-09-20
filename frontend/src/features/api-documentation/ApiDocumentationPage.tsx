import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authStorage } from "@/lib/auth-storage"
import { API_ENDPOINTS, type ApiEndpoint, type ApiValues } from "./api-endpoint"
import { API_BASE_URL, sendApiRequest, type ApiRequestResult } from "./api-client"

const methodClass: Record<ApiEndpoint["method"], string> = {
  GET: "text-sky-700",
  POST: "text-emerald-700",
  PUT: "text-amber-700",
  DELETE: "text-rose-700",
}

const toStringValues = (values: ApiValues | undefined): Record<string, string> => {
  return Object.fromEntries(Object.entries(values ?? {}).map(([key, value]) => [key, String(value)]))
}

const formatResponse = (data: unknown) => {
  if (typeof data === "string") return data || "(empty response)"
  return JSON.stringify(data, null, 2) ?? "(empty response)"
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof SyntaxError) return "Request body harus berupa JSON valid"
  if (error instanceof Error) return error.message
  return "Request gagal dikirim"
}

const ApiDocumentationPage = () => {
  const [selectedId, setSelectedId] = useState(API_ENDPOINTS[0].id)
  const [token, setToken] = useState(() => authStorage.getToken() ?? "")
  const [params, setParams] = useState<Record<string, string>>({})
  const [query, setQuery] = useState<Record<string, string>>({})
  const [bodyText, setBodyText] = useState("")
  const [result, setResult] = useState<ApiRequestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const endpoint = useMemo(
    () => API_ENDPOINTS.find((item) => item.id === selectedId) ?? API_ENDPOINTS[0],
    [selectedId],
  )

  useEffect(() => {
    setParams(toStringValues(endpoint.params))
    setQuery(toStringValues(endpoint.query))
    setBodyText(endpoint.body ? JSON.stringify(endpoint.body, null, 2) : "")
    setResult(null)
    setError("")
  }, [endpoint])

  const updateObjectField = (
    setter: Dispatch<SetStateAction<Record<string, string>>>,
    key: string,
    value: string,
  ) => {
    setter((current) => ({ ...current, [key]: value }))
  }

  const handleSend = async () => {
    setLoading(true)
    setError("")

    try {
      const body = bodyText.trim() ? JSON.parse(bodyText) as unknown : undefined
      const response = await sendApiRequest({ endpoint, token, params, query, body })
      setResult(response)

      if (endpoint.id === "login" && isLoginResult(response.data)) {
        authStorage.setSession(response.data.data.token, response.data.data.user)
        setToken(response.data.data.token)
        window.dispatchEvent(new Event("auth:session-updated"))
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError))
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!result || typeof result.data !== "string") return
    const blob = new Blob([result.data], { type: result.contentType || "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "api-response.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  const isCsvResponse = result?.contentType.includes("text/csv") && typeof result.data === "string"

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="mt-0 text-4xl">API Documentation</h1>
      </header>

      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <Card className="h-fit">
          <CardHeader className="border-b">
            <CardTitle>Endpoints</CardTitle>
            <CardDescription>{API_ENDPOINTS.length} endpoint</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 p-3">
            {API_ENDPOINTS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`w-full rounded-none border-l-2 px-3 py-2 text-left transition-colors ${
                  item.id === endpoint.id ? "border-primary bg-primary/10" : "border-transparent hover:bg-muted"
                }`}
              >
                <span className={`block font-mono text-[0.65rem] font-bold tracking-wider ${methodClass[item.method]}`}>
                  {item.method}
                </span>
                <span className="block truncate text-sm font-medium">{item.label}</span>
                <span className="block truncate font-mono text-[0.65rem] text-muted-foreground">{item.path}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="min-w-0 space-y-5">
          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={`font-mono ${methodClass[endpoint.method]}`}>{endpoint.method}</Badge>
                <code className="break-all bg-transparent p-0 text-sm">{API_BASE_URL}{endpoint.path}</code>
              </div>
              <CardDescription>
                {endpoint.auth ? `Requires Bearer token${endpoint.roles ? ` - ${endpoint.roles.join(" / ")}` : ""}` : "Public endpoint"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <Label htmlFor="api-token">Authorization token</Label>
                <Input
                  id="api-token"
                  type="password"
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  placeholder={endpoint.auth ? "Paste JWT token" : "Optional for public endpoint"}
                />
              </div>

              {Object.keys(params).length > 0 && (
                <FieldGroup title="Path parameters" values={params} onChange={(key, value) => updateObjectField(setParams, key, value)} />
              )}

              {Object.keys(query).length > 0 && (
                <FieldGroup title="Query parameters" values={query} onChange={(key, value) => updateObjectField(setQuery, key, value)} />
              )}

              {endpoint.body && (
                <div className="space-y-2">
                  <Label htmlFor="api-body">JSON request body</Label>
                  <textarea
                    id="api-body"
                    value={bodyText}
                    onChange={(event) => setBodyText(event.target.value)}
                    spellCheck={false}
                    className="min-h-48 w-full rounded-none border border-input bg-background px-3 py-2 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  />
                </div>
              )}

              <Button type="button" onClick={() => void handleSend()} disabled={loading}>
                {loading ? "Sending..." : "Send Request"}
              </Button>
              {error && <p className="rounded-none border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive" role="alert">{error}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>Response</CardTitle>
                  <CardDescription>{result ? `${result.contentType || "unknown content type"} - ${Object.keys(result.headers).length} headers` : "No request sent yet"}</CardDescription>
                </div>
                {result && <Badge variant={result.ok ? "default" : "destructive"}>{result.status}</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {result ? (
                <>
                  <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                    {Object.entries(result.headers).map(([key, value]) => (
                      <div key={key} className="rounded-none border bg-muted/30 px-3 py-2">
                        <span className="font-semibold text-foreground">{key}:</span> {value}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-sm font-medium">Response body</span>
                    {isCsvResponse && <Button type="button" variant="outline" size="sm" onClick={handleDownload}>Download CSV</Button>}
                  </div>
                  <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-none bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100">{formatResponse(result.data)}</pre>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Response JSON</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

type FieldGroupProps = {
  title: string
  values: Record<string, string>
  onChange: (key: string, value: string) => void
}

const FieldGroup = ({ title, values, onChange }: FieldGroupProps) => (
  <div className="space-y-3">
    <h2 className="m-0 text-sm font-semibold tracking-wide uppercase">{title}</h2>
    <div className="grid gap-3 sm:grid-cols-2">
      {Object.entries(values).map(([key, value]) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={`api-${title}-${key}`}>{key}</Label>
          <Input id={`api-${title}-${key}`} value={value} onChange={(event) => onChange(key, event.target.value)} />
        </div>
      ))}
    </div>
  </div>
)

const isLoginResult = (data: unknown): data is {
  data: { token: string; user: { id: number; username: string; role: "admin" | "viewer" } }
} => {
  if (!data || typeof data !== "object" || !("data" in data)) return false
  const result = data.data
  if (!result || typeof result !== "object" || !("token" in result) || !("user" in result)) return false
  return typeof result.token === "string" && typeof result.user === "object" && result.user !== null
    && "id" in result.user && "username" in result.user && "role" in result.user
}

export default ApiDocumentationPage
