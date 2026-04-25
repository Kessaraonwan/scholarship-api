# Deployment & Operations Guide

Production deployment guide สำหรับ Scholarship API

---

## 🚀 Pre-Deployment Checklist

### Code Quality

- [ ] All tests passing: `npm run test`
- [ ] No linting errors: `npm run lint`
- [ ] TypeScript types valid: `npm run type-check`
- [ ] No console.logs in production code
- [ ] No hardcoded secrets (use env vars)
- [ ] No .env files committed

### Documentation

- [ ] README updated
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Breaking changes noted in CHANGELOG
- [ ] Version bump in package.json

### Security

- [ ] Dependencies up to date: `npm audit`
- [ ] No vulnerable packages
- [ ] API keys rotated
- [ ] CORS configured correctly
- [ ] Rate limiting enabled

---

## 📦 Versioning

### Semantic Versioning: MAJOR.MINOR.PATCH

```
v1.2.3
│ │ └─ PATCH: bug fixes
│ └─── MINOR: backward-compatible features
└───── MAJOR: breaking changes
```

### Update Version

```bash
# In package.json
{
  "version": "1.2.3"
}

# Create git tag
git tag v1.2.3
git push origin v1.2.3
```

---

## 🐳 Docker Production Build

### Build Images

```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Build single service
docker-compose -f docker-compose.prod.yml build service-landing
```

### Push to Registry

```bash
# Login to registry
docker login ghcr.io

# Tag image
docker tag service-landing:latest ghcr.io/your-org/scholarship-api/service-landing:v1.2.3

# Push to registry
docker push ghcr.io/your-org/scholarship-api/service-landing:v1.2.3
```

---

## ☁️ Deployment Options

### Option 1: Docker Swarm

```bash
# Deploy stack
docker stack deploy -c docker-compose.prod.yml scholarship-api

# Update service
docker service update --image ghcr.io/your-org/service-landing:v1.2.3 scholarship-api_service-landing

# View services
docker service ls
docker service logs scholarship-api_service-landing
```

### Option 2: Kubernetes

```bash
# Deploy with Helm
helm install scholarship-api ./helm/scholarship-api \
  --values production-values.yaml

# Update deployment
kubectl set image deployment/service-landing \
  service-landing=ghcr.io/your-org/service-landing:v1.2.3

# Check status
kubectl get deployments
kubectl logs -f deployment/service-landing
```

### Option 3: Cloud Run (GCP) / ECS (AWS) / App Service (Azure)

See respective cloud provider documentation.

---

## 🔧 Environment Configuration

### Production .env

```env
# Node
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@prod-db-host:5432/scholarship_db
DB_POOL_SIZE=20

# Redis
REDIS_URL=redis://:password@prod-redis-host:6379/0
REDIS_TLS=true

# Authentication
JWT_SECRET=<long-secure-random-string>
JWT_EXPIRY=7d
INTERNAL_SECRET=<another-long-secure-random-string>

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@scholarship-api.com
SMTP_PASS=<app-password>

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/yyy
LOG_LEVEL=info

# Feature Flags
ENABLE_WEBHOOKS=true
ENABLE_ANALYTICS=true

# Rate Limiting
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 📊 Monitoring & Logging

### Health Checks

```bash
# Check all services
curl http://api.scholarship-api.com/status

# Individual service health
curl http://api.scholarship-api.com/api/health
curl http://auth-api.scholarship-api.com/health
```

### Logs

```bash
# Docker
docker-compose -f docker-compose.prod.yml logs -f

# Kubernetes
kubectl logs -f deployment/service-landing

# Cloud provider logs
# See cloud provider documentation
```

### Monitoring Stack (Recommended)

- **Prometheus**: Metrics collection
- **Grafana**: Visualization
- **ELK Stack**: Log aggregation
- **Sentry**: Error tracking
- **New Relic / DataDog**: APM

---

## 🔄 Zero-Downtime Deployment

### Strategy: Rolling Updates

```bash
# Kubernetes (automatic)
kubectl set image deployment/service-landing \
  service-landing=ghcr.io/your-org/service-landing:v1.2.3 \
  --record

# Docker Swarm
docker service update --image ghcr.io/your-org/service-landing:v1.2.3 \
  scholarship-api_service-landing

# Check rollout status
kubectl rollout status deployment/service-landing
```

### Before Deployment

1. ✅ Verify load balancer health
2. ✅ Check database backups
3. ✅ Ensure no traffic spikes
4. ✅ Have rollback plan ready

### During Deployment

1. 📊 Monitor metrics
2. 📝 Monitor logs
3. 🚨 Monitor alerts
4. ⏱️ Monitor response times

### Rollback if Issues

```bash
# Kubernetes
kubectl rollout undo deployment/service-landing
kubectl rollout history deployment/service-landing

# Docker Swarm
docker service update --image <old-image> \
  scholarship-api_service-landing

# Git rollback (if needed)
git revert <commit-hash>
git push origin main
```

---

## 🔐 Security Hardening

### Secrets Management

```bash
# Use secrets manager, not .env files
# Examples:
# - HashiCorp Vault
# - AWS Secrets Manager
# - Google Secret Manager
# - Azure Key Vault

# Access secrets in code:
const secret = process.env.JWT_SECRET;
```

### SSL/TLS

```bash
# Generate self-signed cert (dev only)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

# Production: use Let's Encrypt + Certbot
certbot certonly --standalone -d api.scholarship-api.com
```

### Network Security

- ✅ Use VPN for internal communication
- ✅ Firewall rules configured
- ✅ IP whitelisting where possible
- ✅ DDoS protection enabled
- ✅ WAF (Web Application Firewall) configured

---

## 🚨 Incident Response

### Alert Triggers

| Alert | Severity | Action |
|-------|----------|--------|
| Service Down | Critical | Page oncall, restart service |
| High Error Rate (>5%) | High | Check logs, investigate |
| Database Connection Failed | Critical | Check DB health, reconnect |
| Memory Usage >80% | Medium | Monitor, plan scaling |
| Response Time >2s avg | High | Check queries, optimize |

### Incident Runbook

```
1. Assess severity
2. Notify team (#incidents channel)
3. Check service health
4. View recent logs & metrics
5. Identify root cause
6. Implement fix or rollback
7. Verify recovery
8. Post-mortem meeting
```

---

## 📈 Scaling

### Vertical Scaling (more resources)

```bash
# Increase CPU/Memory in Kubernetes
kubectl patch deployment service-landing --patch '
{
  "spec": {
    "template": {
      "spec": {
        "containers": [{
          "name": "service-landing",
          "resources": {
            "requests": {"cpu": "1000m", "memory": "1Gi"},
            "limits": {"cpu": "2000m", "memory": "2Gi"}
          }
        }]
      }
    }
  }
}'
```

### Horizontal Scaling (more instances)

```bash
# Scale to 3 replicas
kubectl scale deployment service-landing --replicas=3

# Autoscaling based on CPU
kubectl autoscale deployment service-landing --min=3 --max=10 --cpu-percent=80
```

### Database Scaling

```bash
# Read replicas for read-heavy workloads
# Connection pooling with PgBouncer
# Caching layer with Redis
# Query optimization
```

---

## 💾 Backup & Recovery

### Database Backups

```bash
# Backup PostgreSQL
pg_dump scholarship_db > backup.sql

# Schedule daily backups
0 2 * * * pg_dump scholarship_db | gzip > /backups/$(date +\%Y\%m\%d).sql.gz

# Test restore
psql scholarship_db < backup.sql
```

### Recovery Plan

```bash
# Point-in-time recovery
pg_basebackup -D /backup -U postgres -Pv -R

# Check backup integrity
pg_verify_backup /backup
```

---

## 🧹 Maintenance

### Regular Tasks

```bash
# Weekly
- Review error logs & alerts
- Check disk usage
- Verify backups

# Monthly
- Update dependencies
- Security audit
- Performance review
- Capacity planning

# Quarterly
- Major version upgrades
- Disaster recovery drill
- Security audit (full)
- Load testing
```

### Database Maintenance

```bash
# Vacuum & analyze (PostgreSQL)
VACUUM ANALYZE;

# Monitor table size
SELECT * FROM pg_tables;

# Check index performance
SELECT * FROM pg_stat_user_indexes;
```

---

## 📞 On-Call Guide

### On-Call Rotation

- **Slack**: #oncall-rotation
- **Pagerduty**: [link]
- **Phone Tree**: [document]

### Escalation Path

1. Alert → Slack
2. 15 min → SMS/Call
3. 30 min → Escalate to lead
4. 45 min → VP Engineering

### Tools Access

- [ ] AWS Console
- [ ] Kubernetes Dashboard
- [ ] Database Admin Tools
- [ ] Log Aggregation Platform
- [ ] Monitoring Dashboard
- [ ] Secrets Manager

---

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] Code reviewed & approved
- [ ] All tests passing
- [ ] No security warnings
- [ ] Documentation updated
- [ ] Backup taken
- [ ] Rollback plan documented
- [ ] Team notified

### Deployment

- [ ] Monitoring dashboard open
- [ ] Services deployed in order
- [ ] Health checks passing
- [ ] Error rates normal
- [ ] Response times acceptable
- [ ] Users not affected

### Post-Deployment

- [ ] All services healthy
- [ ] Analytics updated
- [ ] Team notified ✅
- [ ] Document any issues
- [ ] Schedule post-mortem if needed

---

## 🆘 Support

**Emergency**: #incident-response on Slack  
**On-Call**: [rotation schedule]  
**Documentation**: [wiki]  
**Runbooks**: [here](./runbooks/)

---

**Last Updated**: April 25, 2026  
**Next Review**: May 25, 2026
