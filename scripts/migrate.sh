echo "Running migrations..."
echo +npx prisma migrate deploy
npx prisma migrate deploy

echo +npx prisma generate
npx prisma generate