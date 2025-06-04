import React, { useEffect, useState } from "react";
import { Bell, ChevronLeft } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useIsMobile } from "../../hooks/useIsMobile";

interface NotificationItem {
    id: string;
    title: string;
    subtitle: string;
    time: string;
}

interface NotificationCenterContentProps {
    setContentMode?: (condition: boolean) => void;
}

export const NotificationCenterContent: React.FC<NotificationCenterContentProps> = ({ setContentMode }) => {
    const { isDarkMode } = useTheme();
    const isMobile = useIsMobile();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    useEffect(() => {
        const fakeData: NotificationItem[] = Array.from({ length: 7 }, (_, i) => ({
            id: `${i}`,
            title: "O Carro P01 está sem sinal",
            subtitle: "GRVT-P01 - Item Monitorado",
            time: "14:02",
        }));

        setNotifications(fakeData);
    }, []);

    return (
        <div className={`p-2 mt-1 ${isMobile ? 'h-full' : 'h-[500px]'} overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500`}>
            <div className="gap-3 mb-2">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <div className="rounded-lg mr-2">
                            {isMobile ? (
                                <ChevronLeft onClick={() => setContentMode?.(false)} size={22} strokeWidth={2} className={isDarkMode ? 'text-gray-300' : 'text-gray-900'} />
                            ) : (
                                <Bell size={18} strokeWidth={1.5} className={isDarkMode ? 'text-gray-300' : 'text-gray-900'} />
                            )}
                        </div>
                        <p onClick={() => setContentMode?.(false)} className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Central de Notificações</p>
                    </div>
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-3 ${isMobile ? 'py-2' : ''}`}>
                    Abaixo você pode visualizar todas as notificações recebidas anteriormente.
                </p>
            </div>
            <div className={`h-[1px] ${isDarkMode ? 'bg-gray-700' : 'bg-[#00000029]'}`} />
            <div className={`space-y-1 mt-4 ${isMobile ? 'px-2' : ''}`}>
                {notifications.map((notif) => (
                    <div className={`flex flex-row items-center ${isMobile ? 'gap-4' : 'gap-3'}`} key={notif.id}>
                        <p className={`${isMobile ? 'text-xs' : 'text-[10px]'} text-gray-400`}>{notif.time}</p>
                        <div key={notif.id} className="py-1">
                            <p className={`${isMobile ? 'text-sm' : 'text-xs'} ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {notif.title}
                            </p>
                            <p className={`${isMobile ? 'text-xs' : 'text-[10px]'} text-gray-400`}>{notif.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
