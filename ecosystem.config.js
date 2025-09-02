module.exports = {
  apps: [
    {
      name: 'lms-api',
      cwd: '/root/lms-platform/apps/api',
      script: 'pnpm',
      args: 'dev',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '1G',
      error_file: '/root/lms-platform/logs/api-error.log',
      out_file: '/root/lms-platform/logs/api-out.log',
      log_file: '/root/lms-platform/logs/api-combined.log'
    },
    {
      name: 'lms-web',
      cwd: '/root/lms-platform/apps/web',
      script: 'pnpm',
      args: 'dev',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '1G',
      error_file: '/root/lms-platform/logs/web-error.log',
      out_file: '/root/lms-platform/logs/web-out.log',
      log_file: '/root/lms-platform/logs/web-combined.log'
    },
    {
      name: 'lms-prisma-studio',
      cwd: '/root/lms-platform/packages/database',
      script: 'pnpm',
      args: 'studio',
      env: {
        NODE_ENV: 'production'
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '500M',
      error_file: '/root/lms-platform/logs/prisma-error.log',
      out_file: '/root/lms-platform/logs/prisma-out.log',
      log_file: '/root/lms-platform/logs/prisma-combined.log'
    }
  ]
};
