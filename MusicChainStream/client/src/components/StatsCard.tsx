import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: string; // remix icon class
  iconBgColor: string;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const StatsCard = ({
  title,
  value,
  description,
  icon,
  iconBgColor,
  iconColor,
  trend
}: StatsCardProps) => {
  return (
    <Card className="bg-[#181818] rounded-lg border border-[#282828]">
      <CardContent className="p-5">
        <div className="flex items-center mb-3">
          <div 
            className={`h-10 w-10 rounded-full ${iconBgColor} bg-opacity-20 flex items-center justify-center mr-3`}
          >
            <i className={`${icon} ${iconColor}`}></i>
          </div>
          <h3 className="text-white font-medium">{title}</h3>
        </div>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-[#B3B3B3] mt-1 text-sm">{description}</p>
        {trend && (
          <div className={`mt-3 flex items-center text-xs ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            <i className={`${trend.isPositive ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} mr-1`}></i>
            <span>{trend.value}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
